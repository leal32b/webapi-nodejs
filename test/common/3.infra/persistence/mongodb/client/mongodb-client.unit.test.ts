import { Collection } from 'mongodb'

import { type Logger } from '@/common/1.application/logging/logger'
import { MongodbClient, type MongodbDataSource } from '@/common/3.infra/persistence/mongodb/client/mongodb-client'

import { makeLoggerMock } from '~/common/_doubles/mocks/logger-mock'

vi.mock('mongodb', () => ({
  Collection: vi.fn(),
  MongoClient: {
    connect: vi.fn(() => ({
      close: vi.fn(),
      db: vi.fn(() => ({
        collection: vi.fn(() => new Collection()),
        dropDatabase: vi.fn()
      }))
    }))
  }
}))

type SutTypes = {
  sut: MongodbClient
  dataSource: MongodbDataSource
  logger: Logger
}

const makeSut = async (): Promise<SutTypes> => {
  const dataSource: MongodbDataSource = {
    connectionString: 'any_connection_string',
    database: 'any_database',
    name: 'any_name'
  }
  const params = {
    dataSource,
    logger: makeLoggerMock()
  }
  const sut = MongodbClient.create(params)
  await sut.connect()

  return { sut, ...params }
}

describe('MongodbAdapter', () => {
  describe('success', () => {
    it('gets collection', async () => {
      const { sut } = await makeSut()

      const result = await sut.getCollection('any_collection')

      expect(result).toBeDefined()
    })

    it('returns Right on clearDatabase', async () => {
      const { sut } = await makeSut()

      const result = await sut.clearDatabase()

      expect(result.isRight()).toBe(true)
    })

    it('returns Right on close', async () => {
      const { sut } = await makeSut()

      const result = await sut.close()

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    beforeAll(() => {
      vi.resetAllMocks()
      vi.doMock('mongodb', () => ({
        Collection: vi.fn(),
        MongoClient: {
          connect: vi.fn(() => ({
            close: vi.fn(() => { throw new Error() }),
            dropDatabase: vi.fn(() => { throw new Error() })
          }))
        }
      }))
    })

    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('returns Left with Error on clearDatabase when not in test environment', async () => {
      const { sut } = await makeSut()
      vi.stubEnv('NODE_ENV', 'any_environment')

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left with Error when close throws', async () => {
      const { sut } = await makeSut()

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left with Error when clearDatabase throws', async () => {
      const { sut } = await makeSut()

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })

    it('returns Left with Error when connect throws', async () => {
      const { logger } = await makeSut()
      const dataSource = {
        connectionString: 'invalid_connectionString',
        database: 'any_database',
        name: 'any_name'
      }
      const mongodbClient = MongodbClient.create({
        dataSource,
        logger
      })

      const result = await mongodbClient.connect()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(Error)
    })
  })
})
