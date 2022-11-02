import { MongoClient, Collection } from 'mongodb'

import { Either, left, right } from '@/core/0.domain/utils/either'
import { getVar } from '@/core/0.domain/utils/var'
import { PersistenceClient } from '@/core/3.infra/persistence/persistence-client'

export type MongodbDataSource = {
  name: string
  database: string
  connectionString: string
}

type ConstructParams = {
  dataSource: MongodbDataSource
}

export class MongodbClient implements PersistenceClient {
  mongoClient: MongoClient

  constructor (private readonly props: ConstructParams) { }

  async clearDatabase (): Promise<Either<Error, void>> {
    const isTest = getVar('NODE_ENV') === 'test'

    if (!isTest) {
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

  async connect (): Promise<Either<Error, void>> {
    const { connectionString } = this.props.dataSource

    try {
      this.mongoClient = await MongoClient.connect(connectionString)
      const { name, database } = this.props.dataSource

      console.log(`connected to ${database} (dataSource: ${name})`)

      return right()
    } catch (error) {
      console.log('connect', error)

      return left(error)
    }
  }

  async getCollection (name: string): Promise<Collection> {
    const { database } = this.props.dataSource

    return this.mongoClient.db(database).collection(name)
  }
}
