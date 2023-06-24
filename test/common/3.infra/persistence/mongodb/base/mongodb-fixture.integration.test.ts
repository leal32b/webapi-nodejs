import { faker } from '@faker-js/faker'

import { MongodbFixture } from '@/common/3.infra/persistence/mongodb/base/mongodb-fixture'
import { persistence } from '@/common/4.main/container'

import { type MongodbUserEntity } from '@/identity/3.infra/persistence/mongodb/entities/mongodb-user-entity'

class FixtureFake extends MongodbFixture<MongodbUserEntity> {
  static create (): MongodbFixture<MongodbUserEntity> {
    return new FixtureFake({
      collectionName: 'users',
      createDefault: (): any => ({
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.string.alphanumeric(12),
        locale: 'en',
        name: faker.person.firstName(),
        password: faker.string.alphanumeric(12),
        token: faker.string.alphanumeric(12)
      })
    })
  }
}

type SutTypes = {
  sut: MongodbFixture<MongodbUserEntity>
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = FixtureFake.create()

  return { sut }
}

describe('MongodbFixture', () => {
  beforeAll(async () => {
    await persistence.mongodb.client.connect()
  })

  afterAll(async () => {
    await persistence.mongodb.client.clearDatabase()
    await persistence.mongodb.client.close()
  })

  describe('success', () => {
    it('returns created entity when no props are provided', async () => {
      const { sut } = await makeSut()

      const result = await sut.createRandomFixture()

      expect(result).toEqual({
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
        name: expect.any(String),
        password: expect.any(String),
        token: expect.any(String)
      })
    })

    it('returns created entity with provided props', async () => {
      const { sut } = await makeSut()
      const props = { name: 'any_name' }

      const result = await sut.createFixture(props)

      expect(result).toEqual({
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
        name: 'any_name',
        password: expect.any(String),
        token: expect.any(String)
      })
    })

    it('returns created entities with provided props', async () => {
      const { sut } = await makeSut()
      const props1 = { name: 'any_name1' }
      const props2 = { name: 'any_name2' }

      const result = await sut.createFixtures([props1, props2])

      expect(result).toEqual([{
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
        name: 'any_name1',
        password: expect.any(String),
        token: expect.any(String)
      },
      {
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
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
