import { type Repository } from 'typeorm'

import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { persistence } from '@/common/4.main/container'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { GroupEntity, type GroupEntityProps } from '@/identity/0.domain/entities/group.entity'
import { UserEntity, type UserEntityProps } from '@/identity/0.domain/entities/user.entity'
import { UserToken } from '@/identity/0.domain/value-objects/user.token.value-object'
import { type PostgresUserGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user-group.entity'
import { PostgresUserMapper } from '@/identity/3.infra/persistence/postgres/mappers/postgres-user.mapper'
import { PostgresUserRepository } from '@/identity/3.infra/persistence/postgres/repositories/postgres-user.repository'

import { makeMessageBrokerMock } from '~/common/_doubles/mocks/message-broker.mock'
import { makeGroupEntityFake } from '~/identity/_doubles/fakes/group-entity.fake'
import { makeUserAggregateFake } from '~/identity/_doubles/fakes/user-aggregate.fake'
import { PostgresGroupFixture } from '~/identity/_fixtures/postgres/postgres-group.fixture'
import { PostgresUserGroupFixture } from '~/identity/_fixtures/postgres/postgres-user-group.fixture'
import { PostgresUserFixture } from '~/identity/_fixtures/postgres/postgres-user.fixture'

type SutTypes = {
  groupFixture: PersistenceFixture<GroupEntityProps>
  userFixture: PersistenceFixture<UserEntityProps>
  userGroupFixture: PersistenceFixture<PostgresUserGroupEntity>
  userGroupRepository: Repository<any>
  userRepository: Repository<any>
  groupEntityFake: GroupEntity
  userAggregateFake: UserAggregate
  messageBroker: MessageBroker
  sut: PostgresUserRepository
}

const makeSut = async (): Promise<SutTypes> => {
  const collaborators = {
    groupFixture: PostgresGroupFixture.create(),
    userFixture: PostgresUserFixture.create(),
    userGroupFixture: PostgresUserGroupFixture.create(),
    userGroupRepository: await persistence.postgres.client.getRepository('user_group'),
    userRepository: await persistence.postgres.client.getRepository('user')
  }
  const doubles = {
    groupEntityFake: makeGroupEntityFake(),
    userAggregateFake: makeUserAggregateFake()
  }
  const props = {
    messageBroker: makeMessageBrokerMock()
  }
  const sut = PostgresUserRepository.create(props)

  return {
    ...collaborators,
    ...doubles,
    ...props,
    sut
  }
}

describe('UserPostgresRepository', () => {
  beforeAll(async () => {
    await persistence.postgres.client.connect()
  })

  afterEach(async () => {
    await persistence.postgres.client.clearDatabase()
  })

  describe('success', () => {
    describe('create', () => {
      it('calls messageBroker.publishToTopic with correct params', async () => {
        const { sut, messageBroker, userAggregateFake } = await makeSut()
        const publishToTopicSpy = vi.spyOn(messageBroker, 'publishToTopic')

        await sut.create(userAggregateFake)

        expect(publishToTopicSpy).toHaveBeenCalledWith(
          { name: 'userEventsTopic' },
          ['userCreated', '#'],
          {
            props: {
              aggregateId: userAggregateFake.aggregateRoot.id,
              createdAt: expect.any(Date),
              payload: {
                email: 'any@mail.com',
                id: expect.any(String),
                locale: 'en',
                token: 'any_token'
              }
            }
          })
      })

      it('saves data and returns Right on create success', async () => {
        const { sut, userAggregateFake, userRepository } = await makeSut()
        const id = userAggregateFake.aggregateRoot.id

        const result = await sut.create(userAggregateFake)

        expect(result.isRight()).toBe(true)
        const savedData = await userRepository
          .findOne({ where: { id } })
          .then(user => PostgresUserMapper.toDomain(user))
        expect(savedData).toEqual(userAggregateFake)
      })
    })

    describe('readByEmail', () => {
      it('returns Right with null on readByEmail if user does not exist', async () => {
        const { sut } = await makeSut()
        const email = 'not_in_base@mail.com'

        const result = await sut.readByEmail(email)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with UserAggregate on readByEmail success', async () => {
        const { sut, userFixture } = await makeSut()
        const { email } = await userFixture.createFixture()

        const result = await sut.readByEmail(email)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
      })

      it('returns Right with UserAggregate and groups on readByEmail success', async () => {
        const { sut, groupFixture, userFixture, userGroupFixture } = await makeSut()
        const { id: groupId } = await groupFixture.createFixture()
        const { id: userId, email } = await userFixture.createFixture()
        await userGroupFixture.createFixture({ groupId, userId })

        const result = await sut.readByEmail(email)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
        expect((result.value as UserAggregate).groups[0].id).toEqual(groupId)
      })
    })

    describe('readById', () => {
      it('returns Right with null on readById if user does not exist', async () => {
        const { sut } = await makeSut()
        const id = 'not_in_base_id'

        const result = await sut.readById(id)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with UserAggregate on readById success', async () => {
        const { sut, userFixture } = await makeSut()
        const { id } = await userFixture.createFixture()

        const result = await sut.readById(id)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
      })

      it('returns Right with UserAggregate and groups on readById success', async () => {
        const { sut, groupFixture, userFixture, userGroupFixture } = await makeSut()
        const { id: groupId } = await groupFixture.createFixture()
        const { id: userId } = await userFixture.createFixture()
        await userGroupFixture.createFixture({ groupId, userId })

        const result = await sut.readById(userId)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
        expect((result.value as UserAggregate).groups[0].id).toEqual(groupId)
      })
    })

    describe('readByToken', () => {
      it('returns Right with null on readByToken when no user with token is found', async () => {
        const { sut } = await makeSut()
        const token = 'not_in_base_token'

        const result = await sut.readByToken(token)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with UserAggregate on readByToken success', async () => {
        const { sut, userFixture } = await makeSut()
        const { token } = await userFixture.createFixture()

        const result = await sut.readByToken(token)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
      })

      it('returns Right with UserAggregate and groups on readByToken success', async () => {
        const { sut, groupFixture, userFixture, userGroupFixture } = await makeSut()
        const { id: groupId } = await groupFixture.createFixture()
        const { id: userId, token } = await userFixture.createFixture()
        await userGroupFixture.createFixture({ groupId, userId })

        const result = await sut.readByToken(token)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
        expect((result.value as UserAggregate).groups[0].id).toEqual(groupId)
      })
    })

    describe('update', () => {
      it('updates data and returns Right on update success', async () => {
        const { sut, userAggregateFake, userFixture, userRepository } = await makeSut()
        const { id } = userAggregateFake.aggregateRoot
        const token = 'new_token'
        await userFixture.createFixture({ id })
        userAggregateFake.setToken(UserToken.create(token).value as UserToken)

        const result = await sut.update(userAggregateFake)

        expect(result.isRight()).toBe(true)
        const savedData = await userRepository.findOne({ where: { id } })
        expect(savedData.id).toEqual(id)
        expect(savedData.token).toEqual(token)
      })

      it('updates data and returns Right on update adding groups', async () => {
        const { sut, groupFixture, userFixture, userGroupRepository } = await makeSut()
        const group = await groupFixture.createFixture()
        const user = await userFixture.createFixture()
        const userEntity = UserEntity.create(user).value as UserEntity
        const groupEntity = GroupEntity.create(group).value as GroupEntity
        const userAggregate = UserAggregate.create(userEntity)
        userAggregate.setGroups([groupEntity])

        const result = await sut.update(userAggregate)

        expect(result.isRight()).toBe(true)
        const savedData = await userGroupRepository.findOne({
          where: {
            groupId: group.id,
            userId: user.id
          }
        })
        expect(savedData).not.toBe(null)
      })

      it('updates data and returns Right on update removing groups', async () => {
        const { sut, groupFixture, userFixture, userGroupFixture, userGroupRepository } = await makeSut()
        const group = await groupFixture.createFixture()
        const user = await userFixture.createFixture()
        await userGroupFixture.createFixture({
          groupId: group.id,
          userId: user.id
        })
        const userEntity = UserEntity.create(user).value as UserEntity
        const userAggregate = UserAggregate.create(userEntity)

        const result = await sut.update(userAggregate)

        expect(result.isRight()).toBe(true)
        const savedData = await userGroupRepository.findOne({
          where: {
            groupId: group.id,
            userId: user.id
          }
        })
        expect(savedData).toBe(null)
      })
    })
  })

  describe('failure', () => {
    describe('create', () => {
      it('returns Left when create throws', async () => {
        const { sut, userAggregateFake } = await makeSut()
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.create(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByEmail', () => {
      it('returns Left when readByEmail throws', async () => {
        const { sut } = await makeSut()
        const email = 'any@mail.com'
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.readByEmail(email)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readById', () => {
      it('returns Left when readById throws', async () => {
        const { sut } = await makeSut()
        const id = 'any_id'
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.readById(id)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByToken', () => {
      it('returns Left when readByToken throws', async () => {
        const { sut } = await makeSut()
        const token = 'any_token'
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.readByToken(token)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('update', () => {
      it('returns Left on update when it throws', async () => {
        const { sut, userAggregateFake } = await makeSut()
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.update(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })
  })
})
