import { Collection, MongoClient } from 'mongodb'

const HOST = process.env.DB_MONGODB_HOST
const PORT = process.env.DB_MONGODB_PORT
const DATABASE = process.env.DB_MONGODB_DATABASE
const USERNAME = process.env.DB_MONGODB_USERNAME
const PASSWORD = process.env.DB_MONGODB_PASSWORD
const CONNECTION_STRING = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`

export const MongodbAdapter = {
  mongoClient: null as MongoClient,
  connectionString: null as string,

  async connect (uri: string = CONNECTION_STRING): Promise<void> {
    this.mongoClient = await MongoClient.connect(uri)
    this.connectionString = uri

    console.log(`mongodb connected at ${uri}`)
  },

  async close (): Promise<void> {
    await (this.mongoClient as MongoClient).close()
  },

  getCollection (name: string): Collection {
    return (this.mongoClient as MongoClient).db(DATABASE).collection(name)
  },

  map (collection: any): any {
    const { _id: id, ...collectionWithoutId } = collection

    return { id, ...collectionWithoutId }
  }
}
