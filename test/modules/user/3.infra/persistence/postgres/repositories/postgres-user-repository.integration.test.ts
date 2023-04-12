import { type MessageBroker } from '@/core/1.application/events/message-broker'
import { type PersistenceFixture } from '@/core/3.infra/persistence/persistence-fixture'
import { persistence } from '@/core/4.main/container'
import { UserAggregate, type UserAggregateProps } from '@/user/0.domain/aggregates/user-aggregate'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'
import { PostgresUserRepository } from '@/user/3.infra/persistence/postgres/repositories/postgres-user-repository'

import { makeMessageBrokerMock } from '~/core/_doubles/mocks/message-broker-mock'
import { PostgresUserFixture } from '~/user/_fixtures/postgres/postgres-user-fixture'

const makeUserAggregateFake = (): UserAggregate => {
  return UserAggregate.create({
    email: 'any@mail.com',
    id: 'any_id',
    locale: 'en',
    name: 'any_name',
    password: 'hashed_password',
    token: 'any_token'
  }).value as UserAggregate
}

type SutTypes = {
  sut: PostgresUserRepository
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
    userFixture: PostgresUserFixture.create()
  }
  const sut = PostgresUserRepository.create(props)

  return { sut, ...collaborators, ...doubles, ...props }
}

describe('UserPostgresRepository', () => {
  beforeAll(async () => {
    await persistence.postgres.client.connect()
  })

  afterAll(async () => {
    await persistence.postgres.client.clearDatabase()
    await persistence.postgres.client.close()
  })

  describe('success', () => {
    it('calls messageBroker.publishToTopic with correct params', async () => {
      const { sut, messageBroker, userAggregateFake } = makeSut()
      const publishToTopicSpy = vi.spyOn(messageBroker, 'publishToTopic')

      const result = await sut.create(userAggregateFake)

      expect(publishToTopicSpy).toHaveBeenCalledWith(
        { name: 'userCreatedTopic' },
        ['userCreated', '#'],
        {
          props: {
            aggregateId: 'any_id',
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

    it('returns Right with null on readByEmail if user does not exist', async () => {
      const { sut } = makeSut()
      const email = 'any2@mail.com'

      const result = await sut.readByEmail(email)

      expect(result.isRight()).toBe(true)
      expect(result.value).toBe(null)
    })

    it('returns Right with UserAggregate on readByEmail success', async () => {
      const { sut, userFixture } = makeSut()
      const email = 'any2@mail.com'
      await userFixture.createFixture({ email })

      const result = await sut.readByEmail(email)

      expect(result.isRight()).toBe(true)
      expect(result.value).toBeInstanceOf(UserAggregate)
    })

    it('returns Right with null on readById if user does not exist', async () => {
      const { sut } = makeSut()
      const id = 'any_id2'

      const result = await sut.readById(id)

      expect(result.isRight()).toBe(true)
      expect(result.value).toBe(null)
    })

    it('returns Right with UserAggregate on readById success', async () => {
      const { sut, userFixture } = makeSut()
      const id = 'any_id2'
      await userFixture.createFixture({ id })

      const result = await sut.readById(id)

      expect(result.isRight()).toBe(true)
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
      vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.create(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readByEmail throws', async () => {
      const { sut } = makeSut()
      const email = 'any@mail.com'
      vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.readByEmail(email)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readById throws', async () => {
      const { sut } = makeSut()
      const id = 'any_id'
      vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.readById(id)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left on update when it throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.update(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })
  })
})
