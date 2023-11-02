import { ObjectId } from 'mongodb'
import { type Collection } from 'mongoose'

import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { persistence } from '@/common/4.main/container'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { GroupEntity, type GroupEntityProps } from '@/identity/0.domain/entities/group.entity'
import { UserEntity, type UserEntityProps } from '@/identity/0.domain/entities/user.entity'
import { UserToken } from '@/identity/0.domain/value-objects/user.token.value-object'
import { MongodbUserMapper } from '@/identity/3.infra/persistence/mongodb/mappers/mongodb-user.mapper'
import { MongodbUserRepository } from '@/identity/3.infra/persistence/mongodb/repositories/mongodb-user.repository'

import { makeMessageBrokerMock } from '~/common/_doubles/mocks/message-broker.mock'
import { makeUserAggregateFake } from '~/identity/_doubles/fakes/user-aggregate.fake'
import { MongodbGroupFixture } from '~/identity/_fixtures/mongodb/mongodb-group.fixture'
import { MongodbUserFixture } from '~/identity/_fixtures/mongodb/mongodb-user.fixture'

type SutTypes = {
  groupFixture: PersistenceFixture<GroupEntityProps & { users?: any[] }>
  userCollection: Collection
  userFixture: PersistenceFixture<UserEntityProps & { groups?: any[] }>
  userAggregateFake: UserAggregate
  messageBroker: MessageBroker
  sut: MongodbUserRepository
}

const makeSut = async (): Promise<SutTypes> => {
  const collaborators = {
    groupFixture: MongodbGroupFixture.create(),
    userCollection: await persistence.mongodb.client.getCollection('user'),
    userFixture: MongodbUserFixture.create()
  }
  const doubles = {
    userAggregateFake: makeUserAggregateFake()
  }
  const props = {
    messageBroker: makeMessageBrokerMock()
  }
  const sut = MongodbUserRepository.create(props)

  return {
    ...collaborators,
    ...doubles,
    ...props,
    sut
  }
}

describe('UserMongodbRepository', () => {
  beforeAll(async () => {
    await persistence.mongodb.client.connect()
  })

  afterEach(async () => {
    await persistence.mongodb.client.clearDatabase()
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
                locale: 'en',
                token: 'any_token'
              }
            }
          })
      })

      it('saves data and returns Right on create success', async () => {
        const { sut, userAggregateFake, userCollection } = await makeSut()
        const _id = new ObjectId(userAggregateFake.aggregateRoot.id)

        const result = await sut.create(userAggregateFake)

        expect(result.isRight()).toBe(true)
        const savedData = await userCollection
          .findOne({ _id })
          .then(user => MongodbUserMapper.toDomain(user))
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
        const { sut, groupFixture, userFixture } = await makeSut()
        const id = '0123456789ab'
        const group = await groupFixture.createFixture({ users: [new ObjectId(id)] })
        const { email } = await userFixture.createFixture({
          groups: [new ObjectId(group.id)],
          id
        })

        const result = await sut.readByEmail(email)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
        expect((result.value as UserAggregate).groups[0].id).toEqual(new ObjectId(group.id).toString())
      })
    })

    describe('readById', () => {
      it('returns Right with null on readById if user does not exist', async () => {
        const { sut } = await makeSut()
        const id = '999999999999999999999999'

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
        const { sut, groupFixture, userFixture } = await makeSut()
        const id = '0123456789ab'
        const group = await groupFixture.createFixture({ users: [new ObjectId(id)] })
        await userFixture.createFixture({
          groups: [new ObjectId(group.id)],
          id
        })

        const result = await sut.readById(id)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
        expect((result.value as UserAggregate).groups[0].id).toEqual(new ObjectId(group.id).toString())
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
        const { sut, groupFixture, userFixture } = await makeSut()
        const id = '0123456789ab'
        const group = await groupFixture.createFixture({ users: [new ObjectId(id)] })
        const { token } = await userFixture.createFixture({
          groups: [new ObjectId(group.id)],
          id
        })

        const result = await sut.readByToken(token)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
        expect((result.value as UserAggregate).groups[0].id).toEqual(new ObjectId(group.id).toString())
      })
    })

    describe('update', () => {
      it('updates data and returns Right on update success', async () => {
        const { sut, userAggregateFake, userCollection, userFixture } = await makeSut()
        const { id } = userAggregateFake.aggregateRoot
        const _id = new ObjectId(id)
        const token = 'new_token'
        await userFixture.createFixture({ id })
        userAggregateFake.setToken(UserToken.create(token).value as UserToken)

        const result = await sut.update(userAggregateFake)

        expect(result.isRight()).toBe(true)
        const savedData = await userCollection.findOne({ _id })
        expect(savedData._id).toEqual(_id)
        expect(savedData.token).toEqual(token)
      })

      it('updates data and returns Right on update adding groups', async () => {
        const { sut, groupFixture, userAggregateFake, userCollection, userFixture } = await makeSut()
        const { id } = userAggregateFake.aggregateRoot
        const _id = new ObjectId(id)
        const group = await groupFixture.createFixture()
        const groupEntity = GroupEntity.create(group).value as GroupEntity
        await userFixture.createFixture({ id })
        userAggregateFake.setGroups([groupEntity])

        const result = await sut.update(userAggregateFake)

        expect(result.isRight()).toBe(true)
        const savedData = await userCollection.findOne({ _id })
        expect(savedData).not.toBe(null)
        expect(savedData.groups).toEqual([new ObjectId(group.id)])
      })

      it('updates data and returns Right on update removing groups', async () => {
        const { sut, groupFixture, userAggregateFake, userCollection, userFixture } = await makeSut()
        const { id } = userAggregateFake.aggregateRoot
        const _id = new ObjectId(id)
        const group = await groupFixture.createFixture()
        const user = await userFixture.createFixture({ groups: [group.id], id })
        const userAggregate = UserAggregate.create(UserEntity.create(user).value as UserEntity)

        const result = await sut.update(userAggregate)

        expect(result.isRight()).toBe(true)
        const savedData = await userCollection.findOne({ _id })
        expect(savedData.groups).toEqual([])
      })
    })
  })

  describe('failure', () => {
    describe('create', () => {
      it('returns Left when create throws', async () => {
        const { sut, userAggregateFake } = await makeSut()
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.create(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByEmail', () => {
      it('returns Left when readByEmail throws', async () => {
        const { sut } = await makeSut()
        const email = 'any@mail.com'
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.readByEmail(email)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readById', () => {
      it('returns Left when readById throws', async () => {
        const { sut } = await makeSut()
        const id = '999999999999999999999999'
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.readById(id)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByToken', () => {
      it('returns Left when readByToken throws', async () => {
        const { sut } = await makeSut()
        const token = 'any_token'
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.readByToken(token)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('update', () => {
      it('returns Left on update when it throws', async () => {
        const { sut, userAggregateFake } = await makeSut()
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.update(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })
  })
})
