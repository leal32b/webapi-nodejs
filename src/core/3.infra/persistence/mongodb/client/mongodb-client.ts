import { MongoClient, type Collection } from 'mongodb'

import { type Either, left, right } from '@/core/0.domain/utils/either'
import { getVar } from '@/core/0.domain/utils/var'
import { type PersistenceClient } from '@/core/3.infra/persistence/persistence-client'

export type MongodbDataSource = {
  name: string
  database: string
  connectionString: string
}

type Props = {
  dataSource: MongodbDataSource
}

export class MongodbClient implements PersistenceClient {
  private mongoClient: MongoClient

  private constructor (private readonly props: Props) {}

  public static create (props: Props): MongodbClient {
    return new MongodbClient(props)
  }

  public async clearDatabase (): Promise<Either<Error, void>> {
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

  public async close (): Promise<Either<Error, void>> {
    try {
      await this.mongoClient.close()

      console.info('dataSource disconnected')

      return right()
    } catch (error) {
      console.error('close', error)

      return left(error)
    }
  }

  public async connect (): Promise<Either<Error, void>> {
    const { connectionString } = this.props.dataSource

    try {
      this.mongoClient = await MongoClient.connect(connectionString)

      if (!this.mongoClient) {
        throw new Error('mongodb connection error')
      }

      const { name: dataSource, database } = this.props.dataSource

      console.info(`dataSource connected: [${dataSource}] ${database}`)

      return right()
    } catch (error) {
      console.error('connect', error)

      return left(error)
    }
  }

  public async getCollection (name: string): Promise<Collection> {
    const { database } = this.props.dataSource

    return this.mongoClient.db(database).collection(name)
  }
}
