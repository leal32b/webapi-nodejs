import { faker } from '@faker-js/faker'
import { DataSource } from 'typeorm'

import { PgFactory } from '@/core/3.infra/persistence/postgres/base/pg-factory'
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { PgUser } from '@/modules/user/3.infra/persistence/postgres/entities/pg-user'

const makeDataSourceMock = (): DataSource => ({
  initialize: jest.fn(async (): Promise<void> => {}),
  isInitialized: true,
  manager: { save: () => {} },
  getRepository: jest.fn(async (): Promise<any> => ({
    create: (entity) => entity
  }))
}) as any

class FakeFactory extends PgFactory<PgUser> {
  static create (): PgFactory<PgUser> {
    return new FakeFactory({
      repositoryName: 'PgUser',
      createDefault: (): PgUser => ({
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.random.alphaNumeric(12),
        name: faker.name.firstName(),
        password: faker.random.alphaNumeric(12),
        token: faker.random.alphaNumeric(12)
      })
    })
  }
}

type SutTypes = {
  sut: PgFactory<PgUser>
  dataSourceMock: DataSource
}

const makeSut = (): SutTypes => {
  const fakes = {
    dataSourceMock: makeDataSourceMock()
  }
  pg.connect(fakes.dataSourceMock)
  const sut = FakeFactory.create()

  return { sut, ...fakes }
}

describe('PgFactory', () => {
  describe('success', () => {
    it('returns the created entity when no params are provided', async () => {
      const { sut } = makeSut()

      const result = await sut.createFixtures()

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
      const { sut } = makeSut()
      const params = { name: 'any_name' }

      const result = await sut.createFixtures(params)

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
      const { sut } = makeSut()
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
      const { sut } = makeSut()
      const amount = 3

      const result = await sut.createFixtures(amount)

      expect(result.length).toBe(3)
    })
  })
})
