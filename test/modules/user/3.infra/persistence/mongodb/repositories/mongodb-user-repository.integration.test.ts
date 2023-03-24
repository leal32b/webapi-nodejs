import { type MessageBroker } from '@/core/3.infra/events/message-broker'
import { type DatabaseFixture } from '@/core/3.infra/persistence/database-fixture'
import { persistence } from '@/core/4.main/container'
import { makeMongodbFixtures } from '@/core/4.main/setup/fixtures/make-mongodb-fixtures'
import { UserAggregate, type UserAggregateProps } from '@/user/0.domain/aggregates/user-aggregate'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'
import { MongodbUserRepository } from '@/user/3.infra/persistence/mongodb/repositories/mongodb-user-repository'

import { makeMessageBrokerMock } from '~/core/mocks/message-broker-mock'

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
  userFixture: DatabaseFixture<UserAggregateProps>
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
    userFixture: makeMongodbFixtures.userFixture
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
    it('calls messageBroker.publishToQueue with correct params', async () => {
      const { sut, messageBroker, userAggregateFake } = makeSut()
      const publishToQueueSpy = vi.spyOn(messageBroker, 'publishToQueue')

      const result = await sut.create(userAggregateFake)

      expect(publishToQueueSpy).toHaveBeenCalledWith({
        name: 'userCreated'
      },
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

    it('returns null on readByEmail if user does not exist', async () => {
      const { sut } = makeSut()
      const email = 'any2@mail.com'

      const result = await sut.readByEmail(email)

      expect(result.value).toBe(null)
    })

    it('returns an UserAggregate on readByEmail success', async () => {
      const { sut, userFixture } = makeSut()
      const email = 'any2@mail.com'
      await userFixture.createFixture({ email })

      const result = await sut.readByEmail(email)

      expect(result.value).toBeInstanceOf(UserAggregate)
    })

    it('returns null on readById if user does not exist', async () => {
      const { sut } = makeSut()
      const id = 'any_id2'

      const result = await sut.readById(id)

      expect(result.value).toBe(null)
    })

    it('returns an UserAggregate on readById success', async () => {
      const { sut, userFixture } = makeSut()
      const id = '000000000000000000000001'
      await userFixture.createFixture({ id })

      const result = await sut.readById(id)

      expect(result.value).toBeInstanceOf(UserAggregate)
    })

    it('returns Right on update success', async () => {
      const { sut, userAggregateFake } = makeSut()
      const emailConfirmed = EmailConfirmed.create(true).value as EmailConfirmed
      userAggregateFake.emailConfirmed = emailConfirmed

      const result = await sut.update(userAggregateFake)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when create throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.create(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readByEmail throws', async () => {
      const { sut } = makeSut()
      const email = 'any@mail.com'
      vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.readByEmail(email)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readById throws', async () => {
      const { sut } = makeSut()
      const id = 'any_id'
      vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.readById(id)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left on update when it throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      vi.spyOn(persistence.mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.update(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })
  })
})
