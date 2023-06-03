import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence-fixture'
import { persistence } from '@/common/4.main/container'

import { UserAggregate, type UserAggregateProps } from '@/identity/0.domain/aggregates/user-aggregate'
import { EmailConfirmed } from '@/identity/0.domain/value-objects/email-confirmed'
import { MongodbUserRepository } from '@/identity/3.infra/persistence/mongodb/repositories/mongodb-user-repository'

import { makeMessageBrokerMock } from '~/common/_doubles/mocks/message-broker-mock'
import { MongodbUserFixture } from '~/identity/_fixtures/mongodb/mongodb-user-fixture'

const makeUserAggregateFake = (): UserAggregate => {
  return UserAggregate.create({
    email: 'any@mail.com',
    id: '000000000000000000000001',
    locale: 'en',
    name: 'any_name',
    password: 'hashed_password',
    token: 'any_token'
  }).value as UserAggregate
}

type SutTypes = {
  sut: MongodbUserRepository
  messageBroker: MessageBroker
  userFixture: PersistenceFixture<UserAggregateProps>
  userAggregateFake: UserAggregate
}

const makeSut = (): SutTypes => {
  const props = {
    messageBroker: makeMessageBrokerMock()
  }
  const doubles = {
    userAggregateFake: makeUserAggregateFake()
  }
  const collaborators = {
    userFixture: MongodbUserFixture.create()
  }
  const sut = MongodbUserRepository.create(props)

  return { sut, ...collaborators, ...doubles, ...props }
}

describe('UserMongodbRepository', () => {
  beforeAll(async () => {
    await persistence.mongodb.client.connect()
  })

  afterAll(async () => {
    await persistence.mongodb.client.clearDatabase()
    await persistence.mongodb.client.close()
  })

  describe('success', () => {
    describe('create', () => {
      it('calls messageBroker.publishToTopic with correct params', async () => {
        const { sut, messageBroker, userAggregateFake } = makeSut()
        const publishToTopicSpy = vi.spyOn(messageBroker, 'publishToTopic')

        const result = await sut.create(userAggregateFake)

        expect(publishToTopicSpy).toHaveBeenCalledWith(
          { name: 'userCreatedTopic' },
          ['userCreated', '#'],
          {
            props: {
              aggregateId: '000000000000000000000001',
              createdAt: expect.any(Date),
              payload: {
                email: 'any@mail.com',
                locale: 'en',
                token: 'any_token'
              }
            }
          })
        expect(result.isRight()).toBe(true)
      })
    })

    describe('readByEmail', () => {
      it('returns Right with null on readByEmail if user does not exist', async () => {
        const { sut } = makeSut()
        const email = 'any2@mail.com'

        const result = await sut.readByEmail(email)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with UserAggregate on readByEmail', async () => {
        const { sut, userFixture } = makeSut()
        const email = 'any2@mail.com'
        await userFixture.createFixture({ email })

        const result = await sut.readByEmail(email)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
      })
    })

    describe('readById', () => {
      it('returns Right with null on readById if user does not exist', async () => {
        const { sut } = makeSut()
        const id = 'any_id2'

        const result = await sut.readById(id)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns UserAggregate on readById', async () => {
        const { sut, userFixture } = makeSut()
        const id = '000000000000000000000001'
        await userFixture.createFixture({ id })

        const result = await sut.readById(id)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
      })
    })

    describe('readByToken', () => {
      it('returns Right with null on readByToken when no user with token is found', async () => {
        const { sut } = makeSut()
        const token = 'not_in_base_token'

        const result = await sut.readByToken(token)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with UserAggregate on readByToken success', async () => {
        const { sut, userFixture } = makeSut()
        const token = 'in_base_token'
        await userFixture.createFixture({ token })

        const result = await sut.readByToken(token)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBeInstanceOf(UserAggregate)
      })
    })

    describe('update', () => {
      it('returns Right on update success', async () => {
        const { sut, userAggregateFake } = makeSut()
        const emailConfirmed = EmailConfirmed.create(true).value as EmailConfirmed
        userAggregateFake.emailConfirmed = emailConfirmed

        const result = await sut.update(userAggregateFake)

        expect(result.isRight()).toBe(true)
      })
    })
  })

  describe('failure', () => {
    describe('create', () => {
      it('returns Left when create throws', async () => {
        const { sut, userAggregateFake } = makeSut()
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.create(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByEmail', () => {
      it('returns Left when readByEmail throws', async () => {
        const { sut } = makeSut()
        const email = 'any@mail.com'
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.readByEmail(email)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readById', () => {
      it('returns Left when readById throws', async () => {
        const { sut } = makeSut()
        const id = 'any_id'
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.readById(id)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByToken', () => {
      it('returns Left when readByToken throws', async () => {
        const { sut } = makeSut()
        const token = 'any_token'
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.readByToken(token)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('update', () => {
      it('returns Left on update when it throws', async () => {
        const { sut, userAggregateFake } = makeSut()
        vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

        const result = await sut.update(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })
  })
})