
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { UserAggregate } from '@/modules/user/0.domain/aggregates/user-aggregate'
import { PgUserFactory } from '@/modules/user/3.infra/persistence/postgres/factories/user-factory'
import { PgUserRepository } from '@/modules/user/3.infra/persistence/postgres/repositories/pg-user-repository'

const makeFakeUserAggregateFake = (): UserAggregate => {
  return UserAggregate.create({
    email: 'any@mail.com',
    id: 'any_id',
    name: 'any_name',
    password: 'hashed_password',
    token: 'any_token'
  }).value as UserAggregate
}

type SutTypes = {
  sut: PgUserRepository
  pgUserFactory: PgUserFactory
  userAggregateFake: UserAggregate
}

const makeSut = (): SutTypes => {
  const fakes = {
    userAggregateFake: makeFakeUserAggregateFake()
  }
  const collaborators = {
    pgUserFactory: PgUserFactory.create()
  }
  const sut = new PgUserRepository()

  return { sut, ...collaborators, ...fakes }
}

describe('UserPostgresRepository', () => {
  beforeAll(async () => {
    await pg.connect(testDataSource)
  })

  afterAll(async () => {
    await pg.client.clearDatabase()
    await pg.client.close()
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
      const { sut, pgUserFactory } = makeSut()
      const email = 'any2@mail.com'
      await pgUserFactory.createFixtures({ email })

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
      const { sut, pgUserFactory } = makeSut()
      const id = 'any_id2'
      await pgUserFactory.createFixtures({ id })

      const result = await sut.readById(id)

      expect(result.value).toBeInstanceOf(UserAggregate)
    })

    it('returns Right on update success', async () => {
      const { sut, userAggregateFake } = makeSut()
      userAggregateFake.setEmailConfirmed(true)

      const result = await sut.update(userAggregateFake)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when create throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      jest.spyOn(pg.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.create(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readByEmail throws', async () => {
      const { sut } = makeSut()
      const email = 'any@mail.com'
      jest.spyOn(pg.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.readByEmail(email)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readById throws', async () => {
      const { sut } = makeSut()
      const id = 'any_id'
      jest.spyOn(pg.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.readById(id)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left on update when it throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      jest.spyOn(pg.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.update(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })
  })
})
