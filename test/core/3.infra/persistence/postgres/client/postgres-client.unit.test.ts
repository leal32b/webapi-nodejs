import { DataSource } from 'typeorm'

import { PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'

const makeDataSourceMock = (): DataSource => ({
  name: 'any_data_source',
  options: { database: 'any_database' },
  destroy: jest.fn(),
  manager: { save: jest.fn() },
  getRepository: jest.fn(() => ({
    clear: jest.fn()
  })),
  entityMetadatas: [
    { name: 'any_entity_name' }
  ]
}) as any

type SutTypes = {
  sut: PostgresClient
  dataSourceMock: DataSource
}

const makeSut = (): SutTypes => {
  const dataSourceMock = makeDataSourceMock()
  const sut = new PostgresClient({
    dataSource: dataSourceMock
  })

  return { sut, dataSourceMock }
}

describe('PostgresClient', () => {
  describe('success', () => {
    it('gets dataSource manager', async () => {
      const { sut } = makeSut()

      const result = sut.manager

      expect(result).toBeDefined()
    })

    it('gets a repository', async () => {
      const { sut } = makeSut()

      const result = await sut.getRepository('users')

      expect(result).toBeDefined()
    })

    it('returns Right on clearDatabase', async () => {
      const { sut } = makeSut()

      const result = await sut.clearDatabase()

      expect(result.isRight()).toBe(true)
    })

    it('returns Left on clearDatabase when not in test environment', async () => {
      const { sut } = makeSut()
      process.env.NODE_ENV = 'any_environment'

      const result = await sut.clearDatabase()
      process.env.NODE_ENV = 'test'

      expect(result.isLeft()).toBe(true)
    })

    it('returns an Error on clearDatabase when not in test environment', async () => {
      const { sut } = makeSut()
      process.env.NODE_ENV = 'any_environment'

      const result = await sut.clearDatabase()
      process.env.NODE_ENV = 'test'

      expect(result.value).toEqual(new Error('Clear database is allowed only in test environment'))
    })
  })

  describe('failure', () => {
    it('returns Left when close throws', async () => {
      const { sut, dataSourceMock } = makeSut()
      jest.spyOn(dataSourceMock, 'destroy').mockRejectedValueOnce(new Error())

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut, dataSourceMock } = makeSut()
      jest.spyOn(dataSourceMock, 'getRepository').mockImplementationOnce(jest.fn())

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'invalid_host',
        port: 5432,
        username: 'any_username',
        password: 'any_password',
        database: 'any_database'
      })
      const postgresClient = new PostgresClient({ dataSource })

      const result = await postgresClient.connect()

      expect(result.isLeft()).toBe(true)
    })
  })
})
