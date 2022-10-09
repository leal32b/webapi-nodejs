import { DatabaseFactory } from '@/core/3.infra/persistence/database-factory'
import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { postgresFactories } from '@/core/4.main/config/database-factories/postgres-factory'
import { postgresPersistence } from '@/core/4.main/config/persistence/postgres-persistence'
import { UserAggregate, UserAggregateCreateParams } from '@/user/0.domain/aggregates/user-aggregate'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'
import { PostgresUserRepository } from '@/user/3.infra/persistence/postgres/repositories/postgres-user-repository'

const makeUserAggregateFake = (): UserAggregate => {
  return UserAggregate.create({
    email: 'any@mail.com',
    id: 'any_id',
    name: 'any_name',
    password: 'hashed_password',
    token: 'any_token'
  }).value as UserAggregate
}

type SutTypes = {
  sut: PostgresUserRepository
  userFactory: DatabaseFactory<UserAggregateCreateParams>
  userAggregateFake: UserAggregate
}

const makeSut = (): SutTypes => {
  const doubles = {
    userAggregateFake: makeUserAggregateFake()
  }
  const collaborators = {
    userFactory: postgresFactories.userFactory
  }
  const sut = new PostgresUserRepository()

  return { sut, ...collaborators, ...doubles }
}

describe('UserPostgresRepository', () => {
  beforeAll(async () => {
    await postgresPersistence.connect()
  })

  afterAll(async () => {
    await postgresPersistence.clear()
    await postgresPersistence.close()
  })

  describe('success', () => {
    it('returns Right on create success', async () => {
      const { sut, userAggregateFake } = makeSut()

      const result = await sut.create(userAggregateFake)

      expect(result.isRight()).toBe(true)
    })

    it('returns null on readByEmail if user does not exist', async () => {
      const { sut } = makeSut()
      const email = 'any2@mail.com'

      const result = await sut.readByEmail(email)

      expect(result.value).toBe(null)
    })

    it('returns an UserAggregate on readByEmail success', async () => {
      const { sut, userFactory } = makeSut()
      const email = 'any2@mail.com'
      await userFactory.createFixture({ email })

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
      const { sut, userFactory } = makeSut()
      const id = 'any_id2'
      await userFactory.createFixture({ id })

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
      jest.spyOn(postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.create(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readByEmail throws', async () => {
      const { sut } = makeSut()
      const email = 'any@mail.com'
      jest.spyOn(postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.readByEmail(email)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readById throws', async () => {
      const { sut } = makeSut()
      const id = 'any_id'
      jest.spyOn(postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.readById(id)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left on update when it throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      jest.spyOn(postgres.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.update(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })
  })
})