import { Collection } from 'mongodb'

import { getVar, setVar } from '@/core/0.domain/utils/var'
import { type Logger } from '@/core/1.application/logging/logger'
import { MongodbClient, type MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

import { makeLoggerMock } from '~/core/mocks/logger-mock'

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

const NODE_ENV = getVar('NODE_ENV')

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
  afterEach(() => {
    setVar('NODE_ENV', NODE_ENV)
  })

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

    it('returns Left on clearDatabase when not in test environment', async () => {
      const { sut } = await makeSut()
      setVar('NODE_ENV', 'any_environment')

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns an Error on clearDatabase when not in test environment', async () => {
      const { sut } = await makeSut()
      setVar('NODE_ENV', 'any_environment')

      const result = await sut.clearDatabase()

      expect(result.value).toEqual(new Error('Clear database is allowed only in test environment'))
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
      vi.mock('mongodb', () => ({
        MongoClient: {
          connect: vi.fn(() => ({
            close: vi.fn(() => { throw new Error() }),
            dropDatabase: vi.fn(() => { throw new Error() })
          }))
        }
      }))
    })

    it('returns Left when close throws', async () => {
      const { sut } = await makeSut()

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut } = await makeSut()

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
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
    })
  })
})
