import { faker } from '@faker-js/faker'

import { MongodbFixture } from '@/common/3.infra/persistence/mongodb/base/mongodb.fixture'
import { persistence } from '@/common/4.main/container'

import { type MongodbUserEntity } from '@/identity/3.infra/persistence/mongodb/entities/mongodb-user.entity'

class FixtureFake extends MongodbFixture<MongodbUserEntity> {
  static create (): MongodbFixture<MongodbUserEntity> {
    return new FixtureFake({
      collectionName: 'user',
      createDefault: (): MongodbUserEntity => ({
        createdAt: new Date(),
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.string.hexadecimal({ length: 24 }).slice(2),
        locale: 'en',
        name: faker.person.firstName(),
        password: faker.string.alphanumeric(12),
        token: faker.string.alphanumeric(12),
        updatedAt: new Date()
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

  afterEach(async () => {
    await persistence.mongodb.client.clearDatabase()
  })

  describe('success', () => {
    it('returns created entity when no props are provided', async () => {
      const { sut } = await makeSut()

      const result = await sut.createFixture()

      expect(result).toEqual({
        createdAt: expect.any(Date),
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
        name: expect.any(String),
        password: expect.any(String),
        token: expect.any(String),
        updatedAt: expect.any(Date)
      })
    })

    it('returns created entity with provided props', async () => {
      const { sut } = await makeSut()
      const props = { name: 'any_name' }

      const result = await sut.createFixture(props)

      expect(result).toEqual({
        createdAt: expect.any(Date),
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
        name: 'any_name',
        password: expect.any(String),
        token: expect.any(String),
        updatedAt: expect.any(Date)
      })
    })

    it('returns created entities with provided props', async () => {
      const { sut } = await makeSut()
      const props1 = { name: 'any_name_1' }
      const props2 = { name: 'any_name_2' }

      const result = await sut.createFixture([props1, props2])

      expect(result).toEqual([{
        createdAt: expect.any(Date),
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
        name: 'any_name_1',
        password: expect.any(String),
        token: expect.any(String),
        updatedAt: expect.any(Date)
      },
      {
        createdAt: expect.any(Date),
        email: expect.any(String),
        emailConfirmed: false,
        id: expect.any(String),
        locale: 'en',
        name: 'any_name_2',
        password: expect.any(String),
        token: expect.any(String),
        updatedAt: expect.any(Date)
      }])
    })

    it('returns as many created entities as the provided amount', async () => {
      const { sut } = await makeSut()
      const amount = 3

      const result = await sut.createFixture(amount)

      expect(result.length).toBe(3)
    })
  })
})
