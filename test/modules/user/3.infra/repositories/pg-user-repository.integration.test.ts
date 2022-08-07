
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { UserAggregate } from '@/modules/user/0.domain/aggregates/user-aggregate'
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
  userAggregateFake: UserAggregate
}

const makeSut = (): SutTypes => {
  const fakes = {
    userAggregateFake: makeFakeUserAggregateFake()
  }
  const sut = new PgUserRepository()

  return { sut, ...fakes }
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

    it('returns an UserAggregate on readByEmail success', async () => {
      const { sut } = makeSut()

      const result = await sut.readByEmail('any@mail.com')

      expect(result.value).toBeInstanceOf(UserAggregate)
    })

    it('returns an UserAggregate on readById success', async () => {
      const { sut } = makeSut()

      const result = await sut.readById('any_id')

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
    it('returns Left on create when it throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      jest.spyOn(pg.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.create(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left on readByEmail when it throws', async () => {
      const { sut } = makeSut()
      const email = 'any@mail.com'
      jest.spyOn(pg.client, 'getRepository').mockRejectedValueOnce(new Error())

      const result = await sut.readByEmail(email)

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
