import { MongoClient } from 'mongodb'

import { getVar, setVar } from '@/core/0.domain/utils/var'
import { MongodbClient, MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

const NODE_ENV = getVar('NODE_ENV')

const mongoClientMock: MongoClient = ({
  close: vi.fn(),
  db: vi.fn(() => ({
    collection: vi.fn(() => 'any_collection'),
    dropDatabase: vi.fn()
  }))
}) as any

type SutTypes = {
  sut: MongodbClient
  mongoClientMock: MongoClient
}

const makeSut = async (): Promise<SutTypes> => {
  const dataSourceFake: MongodbDataSource = {
    connectionString: 'any_connection_string',
    database: 'any_database',
    name: 'any_name'
  }
  const sut = new MongodbClient({
    dataSource: dataSourceFake
  })
  vi.spyOn(MongoClient, 'connect').mockResolvedValueOnce(mongoClientMock as never)
  await sut.connect()

  return { mongoClientMock, sut }
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
  })

  describe('failure', () => {
    it('returns Left when close throws', async () => {
      const { sut, mongoClientMock } = await makeSut()
      vi.spyOn(mongoClientMock, 'close').mockRejectedValueOnce(new Error() as never)

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut, mongoClientMock } = await makeSut()
      vi.spyOn(mongoClientMock, 'db').mockResolvedValueOnce(null as never)

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
      const { mongoClientMock } = await makeSut()
      const dataSource = {
        connectionString: 'invalid_connectionString',
        database: 'any_database',
        name: 'any_name'
      }
      vi.spyOn(mongoClientMock, 'close').mockRejectedValueOnce(new Error() as never)
      const mongodbClient = new MongodbClient({ dataSource })

      const result = await mongodbClient.connect()

      expect(result.isLeft()).toBe(true)
    })
  })
})
