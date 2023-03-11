import { faker } from '@faker-js/faker'

import { PostgresFixture } from '@/core/3.infra/persistence/postgres/base/postgres-fixture'
import { persistence } from '@/core/4.main/container/index'
import { type PostgresUserEntity } from '@/user/3.infra/persistence/postgres/entities/postgres-user-entity'

class FakeFixture extends PostgresFixture<PostgresUserEntity> {
  static create (): PostgresFixture<PostgresUserEntity> {
    return new FakeFixture({
      createDefault: (): PostgresUserEntity => ({
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.random.alphaNumeric(12),
        name: faker.name.firstName(),
        password: faker.random.alphaNumeric(12),
        token: faker.random.alphaNumeric(12)
      }),
      repositoryName: 'users'
    })
  }
}

type SutTypes = {
  sut: PostgresFixture<PostgresUserEntity>
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = FakeFixture.create()

  return { sut }
}

describe('PostgresFixture', () => {
  beforeAll(async () => {
    await persistence.postgres.client.connect()
  })

  afterAll(async () => {
    await persistence.postgres.client.clearDatabase()
    await persistence.postgres.client.close()
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
