import 'dotenv/config'
import { MongodbAdapter as sut } from '@/3.infra/database/mongodb/adapter/mongodb'

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
})