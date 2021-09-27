import { Collection, MongoClient } from 'mongodb'

export const MongodbAdapter = {
  mongoClient: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.mongoClient = await MongoClient.connect(url)
    console.log('Mongodb connected at ' + url)
  },

  async close (): Promise<void> {
    await (this.mongoClient as MongoClient).close()
  },

  getCollection (name: string): Collection {
    return (this.mongoClient as MongoClient).db().collection(name)
  },

  map (collection: any): any {
    const { _id: id, ...collectionWithoutId } = collection

    return { id, ...collectionWithoutId }
  }
}
