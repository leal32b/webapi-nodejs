import { Collection } from 'mongodb'

import { mongodb } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { mongodbPersistence } from '@/core/4.main/config/persistence/mongodb-persistence'

type SutTypes = {
  sut: typeof mongodb.client
}

const makeSut = async (): Promise<SutTypes> => {
  const sut = mongodb.client

  return { sut }
}

describe('MongodbAdapter', () => {
  beforeAll(async () => {
    await mongodbPersistence.connect()
  })

  afterAll(async () => {
    await mongodbPersistence.close()
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
      const { sut } = await makeSut()
      await sut.close()

      await mongodb.connect({
        name: 'any_name',
        database: 'any_database',
        connectionString: 'invalid_connectionString'
      })

      const result = await mongodb.client.close()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when clearDatabase throws', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await mongodb.client.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when connect throws', async () => {
      const { sut } = await makeSut()
      await sut.close()

      const result = await mongodb.connect({
        name: 'any_name',
        database: 'any_database',
        connectionString: 'invalid_connectionString'
      })

      expect(result.isLeft()).toBe(true)
    })
  })
})
