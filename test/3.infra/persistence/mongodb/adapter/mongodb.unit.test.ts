import 'dotenv/config'

import { MongodbAdapter } from '@/3.infra/persistence/mongodb/adapter/mongodb'

type SutTypes = {
  sut: typeof MongodbAdapter
}

const makeSut = (): SutTypes => {
  const sut = MongodbAdapter

  return { sut }
}

describe('MongodbAdapter', () => {
  const { sut } = makeSut()

  beforeAll(async () => {
    await sut.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await sut.close()
  })

  describe('success', () => {
    it('reconnects when Mongodb is down', async () => {
      let collection = sut.getCollection('any_collection')

      await sut.close()
      collection = sut.getCollection('any_collection')

      expect(collection).toBeTruthy()
    })

    it('calls MongoClient.connect with .env values', async () => {
      await sut.close()
      await sut.connect()

      expect(sut.connectionString).not.toBe(global.__MONGO_URI__)
    })
  })
})
