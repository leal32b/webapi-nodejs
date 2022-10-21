import { MongoClient } from 'mongodb'

import { MongodbClient, MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

const mongoClientMock: MongoClient = ({
  db: jest.fn(() => ({
    collection: jest.fn(() => 'any_collection'),
    dropDatabase: jest.fn()
  })),
  close: jest.fn()
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
  jest.spyOn(MongoClient, 'connect').mockResolvedValueOnce(mongoClientMock as never)
  await sut.connect()

  return { sut, mongoClientMock }
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

    it('returns Left on clearDatabase when not in test environment', async () => {
      const { sut } = await makeSut()
      process.env.NODE_ENV = 'any_environment'

      const result = await sut.clearDatabase()
      process.env.NODE_ENV = 'test'

      expect(result.isLeft()).toBe(true)
    })

    it('returns an Error on clearDatabase when not in test environment', async () => {
      const { sut } = await makeSut()
      process.env.NODE_ENV = 'any_environment'

      const result = await sut.clearDatabase()
      process.env.NODE_ENV = 'test'

      expect(result.value).toEqual(new Error('Clear database is allowed only in test environment'))
    })
  })

  describe('failure', () => {
    it('returns Left when close throws', async () => {
      const { sut, mongoClientMock } = await makeSut()
      jest.spyOn(mongoClientMock, 'close').mockRejectedValueOnce(new Error() as never)

      const result = await sut.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut, mongoClientMock } = await makeSut()
      jest.spyOn(mongoClientMock, 'db').mockResolvedValueOnce(null as never)

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
      const { mongoClientMock } = await makeSut()
      const dataSource = {
        name: 'any_name',
        database: 'any_database',
        connectionString: 'invalid_connectionString'
      }
      jest.spyOn(mongoClientMock, 'close').mockRejectedValueOnce(new Error() as never)
      const mongodbClient = new MongodbClient({ dataSource })

      const result = await mongodbClient.connect()

      expect(result.isLeft()).toBe(true)
    })
  })
})
