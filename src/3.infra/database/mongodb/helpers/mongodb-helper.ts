import { Collection, MongoClient } from 'mongodb'

export const MongodbHelper = {
  mongoClient: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.mongoClient = await MongoClient.connect(url)
  },

  async close (): Promise<void> {
    await this.mongoClient.close()
  },

  getCollection (name: string): Collection {
    return this.mongoClient.db().collection(name)
  }
}
