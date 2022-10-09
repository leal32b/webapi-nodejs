import { MongoClient, Collection } from 'mongodb'

import { Either, left, right } from '@/core/0.domain/utils/either'

export type MongodbDataSource = {
  name: string
  database: string
  connectionString: string
}

type ConstructParams = {
  dataSource: MongodbDataSource
}

class MongodbClient {
  mongoClient: MongoClient

  constructor (private readonly props: ConstructParams) { }

  async connect (message?: string): Promise<Either<Error, void>> {
    const { connectionString } = this.props.dataSource

    try {
      this.mongoClient = await MongoClient.connect(connectionString)
      const { name, database } = this.props.dataSource

      console.log(message || `connected to ${database} (dataSource: ${name})`)

      return right()
    } catch (error) {
      console.log('connect', error)

      return left(error)
    }
  }

  async close (): Promise<Either<Error, void>> {
    try {
      await this.mongoClient.close()

      console.log('disconnected from dataSource')

      return right()
    } catch (error) {
      console.log('close', error)

      return left(error)
    }
  }

  async getCollection (name: string): Promise<Collection> {
    const { database } = this.props.dataSource

    return this.mongoClient.db(database).collection(name)
  }

  async clearDatabase (): Promise<Either<Error, void>> {
    if (process.env.NODE_ENV !== 'test') {
      return left(new Error('Clear database is allowed only in test environment'))
    }

    try {
      const { database } = this.props.dataSource
      await this.mongoClient.db(database).dropDatabase()

      return right()
    } catch (error) {
      return left(error)
    }
  }
}

export const mongodb = {
  client: null as MongodbClient,

  async connect (dataSource: MongodbDataSource): Promise<Either<Error, void>> {
    this.client = new MongodbClient({ dataSource })
    const result = await this.client.connect()

    return result
  }
}
