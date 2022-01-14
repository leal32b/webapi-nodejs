import 'dotenv/config'

import { MongodbAdapter as sut } from '@/3.infra/databases/mongodb/adapter/mongodb'

describe('Mongodb Adapter', () => {
  beforeAll(async () => {
    await sut.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await sut.close()
  })

  it('should reconnect if Mongodb is down', async () => {
    let collection = sut.getCollection('any_collection')

    expect(collection).toBeTruthy()

    await sut.close()
    collection = sut.getCollection('any_collection')

    expect(collection).toBeTruthy()
  })

  it('should call MongoClient.connect with .env values', async () => {
    await sut.close()
    await sut.connect()

    expect(sut.connectionString).not.toBe(global.__MONGO_URI__)
  })
})
