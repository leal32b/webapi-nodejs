import { type DataSource } from 'typeorm'

import { getVar, setVar } from '@/core/0.domain/utils/var'
import { PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { logging } from '@/core/4.main/container/logging'

const NODE_ENV = getVar('NODE_ENV')

const makeDataSourceMock = (): DataSource => ({
  destroy: vi.fn(),
  entityMetadatas: [
    { name: 'any_entity_name' }
  ],
  getRepository: vi.fn(() => ({
    clear: vi.fn()
  })),
  initialize: vi.fn(),
  manager: { save: vi.fn() },
  name: 'any_data_source',
  options: { database: 'any_database' }
}) as any

type SutTypes = {
  sut: PostgresClient
  dataSourceMock: DataSource
}

const makeSut = (): SutTypes => {
  const dataSourceMock = makeDataSourceMock()
  const sut = PostgresClient.create({
    dataSource: dataSourceMock,
    logger: logging.logger
  })

  return { dataSourceMock, sut }
}

describe('PostgresClient', () => {
  afterEach(() => {
    setVar('NODE_ENV', NODE_ENV)
  })

  describe('success', () => {
    it('connects to dataSource', async () => {
      const { sut } = makeSut()

      const result = await sut.connect()

      expect(result.isRight()).toBe(true)
    })

    it('closes connection to dataSource', async () => {
      const { sut } = makeSut()

      const result = await sut.close()

      expect(result.isRight()).toBe(true)
    })

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
      const postgresClient = PostgresClient.create({
        dataSource: null,
        logger: logging.logger
      })

      const result = await postgresClient.connect()

      expect(result.isLeft()).toBe(true)
    })
  })
})
