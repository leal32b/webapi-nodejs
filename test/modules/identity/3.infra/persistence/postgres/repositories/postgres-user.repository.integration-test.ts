import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { persistence } from '@/common/4.main/container'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { type UserEntityProps } from '@/identity/0.domain/entities/user.entity'
import { UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed.value-object'
import { PostgresUserRepository } from '@/identity/3.infra/persistence/postgres/repositories/postgres-user.repository'

import { makeMessageBrokerMock } from '~/common/_doubles/mocks/message-broker.mock'
import { makeUserAggregateFake } from '~/identity/_doubles/fakes/user-aggregate.fake'
import { PostgresUserFixture } from '~/identity/_fixtures/postgres/postgres-user.fixture'

type SutTypes = {
  userFixture: PersistenceFixture<UserEntityProps>
  userAggregateFake: UserAggregate
  messageBroker: MessageBroker
  sut: PostgresUserRepository
}

const makeSut = (): SutTypes => {
  const collaborators = {
    userFixture: PostgresUserFixture.create()
  }
  const doubles = {
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

  afterAll(async () => {
    await persistence.postgres.client.clearDatabase()
    await persistence.postgres.client.close()
  })

  describe('success', () => {
    describe('create', () => {
      it('calls messageBroker.publishToTopic with correct params and returns Right with null on create', async () => {
        const { sut, messageBroker, userAggregateFake } = makeSut()
        const publishToTopicSpy = vi.spyOn(messageBroker, 'publishToTopic')

        const result = await sut.create(userAggregateFake)

        expect(publishToTopicSpy).toHaveBeenCalledWith(
          { name: 'userCreatedTopic' },
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

      it('returns Right with UserAggregate on readByEmail success', async () => {
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
        const id = 'any_id_2'

        const result = await sut.readById(id)

        expect(result.isRight()).toBe(true)
        expect(result.value).toBe(null)
      })

      it('returns Right with UserAggregate on readById success', async () => {
        const { sut, userFixture } = makeSut()
        const id = 'any_id_2'
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
        const emailConfirmed = UserEmailConfirmed.create(true).value as UserEmailConfirmed
        userAggregateFake.setEmailConfirmed(emailConfirmed)

        const result = await sut.update(userAggregateFake)

        expect(result.isRight()).toBe(true)
      })
    })
  })

  describe('failure', () => {
    describe('create', () => {
      it('returns Left when create throws', async () => {
        const { sut, userAggregateFake } = makeSut()
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.create(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByEmail', () => {
      it('returns Left when readByEmail throws', async () => {
        const { sut } = makeSut()
        const email = 'any@mail.com'
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.readByEmail(email)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readById', () => {
      it('returns Left when readById throws', async () => {
        const { sut } = makeSut()
        const id = 'any_id'
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.readById(id)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('readByToken', () => {
      it('returns Left when readByToken throws', async () => {
        const { sut } = makeSut()
        const token = 'any_token'
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.readByToken(token)

        expect(result.isLeft()).toBe(true)
      })
    })

    describe('update', () => {
      it('returns Left on update when it throws', async () => {
        const { sut, userAggregateFake } = makeSut()
        vi.spyOn(persistence.postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

        const result = await sut.update(userAggregateFake)

        expect(result.isLeft()).toBe(true)
      })
    })
  })
})
