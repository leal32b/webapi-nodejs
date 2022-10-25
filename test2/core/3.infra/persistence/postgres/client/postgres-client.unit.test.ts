import { DataSource } from 'typeorm'
import { vi } from 'vitest'

import { getVar, setVar } from '@/core/0.domain/utils/var'
import { PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'

const NODE_ENV = getVar('NODE_ENV')

const makeDataSourceMock = (): DataSource => ({
  name: 'any_data_source',
  options: { database: 'any_database' },
  destroy: vi.fn(),
  manager: { save: vi.fn() },
  getRepository: vi.fn(() => ({
    clear: vi.fn()
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
  afterEach(() => {
    setVar('NODE_ENV', NODE_ENV)
  })

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
      setVar('NODE_ENV', 'any_environment')

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns an Error on clearDatabase when not in test environment', async () => {
      const { sut } = makeSut()
      setVar('NODE_ENV', 'any_environment')

      const result = await sut.clearDatabase()

      expect(result.value).toEqual(new Error('Clear database is allowed only in test environment'))
    })
  })

  describe('failure', () => {
    it('returns Left when close throws', async () => {
      const { sut, dataSourceMock } = makeSut()
      vi.spyOn(dataSourceMock, 'destroy').mockRejectedValueOnce(new Error())

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut, dataSourceMock } = makeSut()
      vi.spyOn(dataSourceMock, 'getRepository').mockImplementationOnce((vi.fn() as any))

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
      const postgresClient = new PostgresClient({ dataSource: null })

      const result = await postgresClient.connect()

      expect(result.isLeft()).toBe(true)
    })
  })
})
