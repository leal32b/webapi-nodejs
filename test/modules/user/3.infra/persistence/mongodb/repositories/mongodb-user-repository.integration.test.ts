import { DatabaseFactory } from '@/core/3.infra/persistence/database-factory'
import { mongodb } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { testDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/test'
import { mongodbFactories } from '@/core/4.main/config/persistence/factories/mongodb-factory'
import { UserAggregate, UserAggregateCreateParams } from '@/user/0.domain/aggregates/user-aggregate'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'
import { MongodbUserRepository } from '@/user/3.infra/persistence/mongodb/repositories/mongodb-user-repository'

const makeUserAggregateFake = (): UserAggregate => {
  return UserAggregate.create({
    email: 'any@mail.com',
    id: '000000000000000000000001',
    name: 'any_name',
    password: 'hashed_password',
    token: 'any_token'
  }).value as UserAggregate
}

type SutTypes = {
  sut: MongodbUserRepository
  userFactory: DatabaseFactory<UserAggregateCreateParams>
  userAggregateFake: UserAggregate
}

const makeSut = (): SutTypes => {
  const doubles = {
    userAggregateFake: makeUserAggregateFake()
  }
  const collaborators = {
    userFactory: mongodbFactories.userFactory
  }
  const sut = new MongodbUserRepository()

  return { sut, ...collaborators, ...doubles }
}

describe('UserMongodbRepository', () => {
  beforeAll(async () => {
    await mongodb.connect(testDataSource)
  })

  afterAll(async () => {
    await mongodb.client.clearDatabase()
    await mongodb.client.close()
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
      const id = '000000000000000000000001'
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
      jest.spyOn(mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.create(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readByEmail throws', async () => {
      const { sut } = makeSut()
      const email = 'any@mail.com'
      jest.spyOn(mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.readByEmail(email)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when readById throws', async () => {
      const { sut } = makeSut()
      const id = 'any_id'
      jest.spyOn(mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.readById(id)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left on update when it throws', async () => {
      const { sut, userAggregateFake } = makeSut()
      jest.spyOn(mongodb.client, 'getCollection').mockRejectedValueOnce(new Error())

      const result = await sut.update(userAggregateFake)

      expect(result.isLeft()).toBe(true)
    })
  })
})
