import { faker } from '@faker-js/faker'

import { MongodbFactory } from '@/core/3.infra/persistence/mongodb/base/mongodb-factory'
import { mongodb } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { testDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/test'
import { UserAggregateCreateParams } from '@/user/0.domain/aggregates/user-aggregate'
import { MongodbUser } from '@/user/3.infra/persistence/mongodb/entities/mongodb-user'

class FakeFactory extends MongodbFactory<MongodbUser> {
  static create (): MongodbFactory<MongodbUser> {
    return new FakeFactory({
      collectionName: 'users',
      createDefault: (): any => ({
        id: faker.random.alphaNumeric(12),
        email: faker.internet.email(),
        emailConfirmed: false,
        name: faker.name.firstName(),
        password: faker.random.alphaNumeric(12),
        token: faker.random.alphaNumeric(12)
      })
    })
  }
}

type SutTypes = {
  sut: MongodbFactory<UserAggregateCreateParams>
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = FakeFactory.create()

  return { sut }
}

describe('MongodbFactory', () => {
  beforeAll(async () => {
    await mongodb.connect(testDataSource)
  })

  afterAll(async () => {
    await mongodb.client.close()
  })

  describe('success', () => {
    it('returns the created entity when no params are provided', async () => {
      const { sut } = await makeSut()

      const result = await sut.createRandomFixture()

      expect(result).toEqual({
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        name: expect.any(String),
        password: expect.any(String),
        token: expect.any(String)
      })
    })

    it('returns created entity with provided params', async () => {
      const { sut } = await makeSut()
      const params = { name: 'any_name' }

      const result = await sut.createFixture(params)

      expect(result).toEqual({
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        name: 'any_name',
        password: expect.any(String),
        token: expect.any(String)
      })
    })

    it('returns created entities with provided params', async () => {
      const { sut } = await makeSut()
      const params1 = { name: 'any_name1' }
      const params2 = { name: 'any_name2' }

      const result = await sut.createFixtures([params1, params2])

      expect(result).toEqual([{
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        name: 'any_name1',
        password: expect.any(String),
        token: expect.any(String)
      },
      {
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        name: 'any_name2',
        password: expect.any(String),
        token: expect.any(String)
      }])
    })

    it('returns as many created entities as the provided amount', async () => {
      const { sut } = await makeSut()
      const amount = 3

      const result = await sut.createRandomFixtures(amount)

      expect(result.length).toBe(3)
    })
  })
})