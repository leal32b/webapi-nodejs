import { Collection } from 'mongodb'

import { mongodb } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { testDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/test'

describe('MongodbAdapter', () => {
  beforeAll(async () => {
    await mongodb.connect(testDataSource)
  })

  afterAll(async () => {
    await mongodb.client.close()
  })

  describe('success', () => {
    it('gets collection', async () => {
      const result = await mongodb.client.getCollection('any_collection')

      expect(result).toBeInstanceOf(Collection)
    })

    it('returns Right on clearDatabase', async () => {
      const result = await mongodb.client.clearDatabase()

      expect(result.isRight()).toBe(true)
    })

    it('returns Right on clearDatabase when it is not a test database', async () => {
      await mongodb.client.close()
      await mongodb.connect({ ...testDataSource, database: 'any_database' })

      const result = await mongodb.client.clearDatabase()

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when connect throws', async () => {
      if (mongodb.client) await mongodb.client.close()

      const result = await mongodb.connect({
        name: 'any_name',
        database: 'any_database',
        connectionString: 'invalid_connectionString'
      })

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when close throws', async () => {
      await mongodb.connect({
        name: 'any_name',
        database: 'any_database',
        connectionString: 'invalid_connectionString'
      })

      const result = await mongodb.client.close()

      expect(result.isLeft()).toBe(true)
    })

    xit('returns Left when clearDatabase throws', async () => {
      await mongodb.client.close()
      // jest.spyOn(MongoClient, '').mockRejectedValueOnce(new Error())

      const result = await mongodb.client.clearDatabase()

      expect(result.isLeft()).toBe(true)
    })
  })
})
