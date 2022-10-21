// unit test 1.98s
import { Collection } from 'mongodb'

import { MongodbClient } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { persistence } from '@/core/4.main/config'

type SutTypes = {
  sut: MongodbClient
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = persistence.mongodb.client

  return { sut }
}

describe('MongodbAdapter', () => {
  beforeAll(async () => {
    await persistence.mongodb.client.connect()
  })

  afterAll(async () => {
    await persistence.mongodb.client.close()
  })

  describe('success', () => {
    it('connects to dataSource', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await sut.connect()

      expect(result.isRight()).toBe(true)
    })

    it('gets collection', async () => {
      const { sut } = await makeSut()

      const result = await sut.getCollection('any_collection')

      expect(result).toBeInstanceOf(Collection)
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
      const dataSource = {
        name: 'any_name',
        database: 'any_database',
        connectionString: 'invalid_connectionString'
      }
      const mongodbClient = new MongodbClient({ dataSource })

      const result = await mongodbClient.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await sut.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
      const dataSource = {
        name: 'any_name',
        database: 'any_database',
        connectionString: 'invalid_connectionString'
      }
      const mongodbClient = new MongodbClient({ dataSource })

      const result = await mongodbClient.connect()

      expect(result.isLeft()).toBe(true)
    })
  })
})
