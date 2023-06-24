import { type DataSource } from 'typeorm'

import { type Logger } from '@/common/1.application/logging/logger'
import { PostgresClient } from '@/common/3.infra/persistence/postgres/client/postgres-client'
import { logging } from '@/common/4.main/container/logging'

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
  dataSource: DataSource
  logger: Logger
  sut: PostgresClient
}

const makeSut = (): SutTypes => {
  const props = {
    dataSource: makeDataSourceMock(),
    logger: logging.logger
  }
  const sut = PostgresClient.create(props)

  return {
    ...props,
    sut
  }
}

describe('PostgresClient', () => {
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
  })

  describe('failure', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('returns Left with Error on clearDatabase when not in test environment', async () => {
      const { sut } = makeSut()
      vi.stubEnv('NODE_ENV', 'any_environment')

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left with Error when close throws', async () => {
      const { sut, dataSource } = makeSut()
      vi.spyOn(dataSource, 'destroy').mockRejectedValueOnce(new Error())

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left with Error when clearDatabase throws', async () => {
      const { sut, dataSource } = makeSut()
      vi.spyOn(dataSource, 'getRepository').mockImplementationOnce((vi.fn() as any))

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left with Error when connect throws', async () => {
      const postgresClient = PostgresClient.create({
        dataSource: null,
        logger: logging.logger
      })

      const result = await postgresClient.connect()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })
  })
})
