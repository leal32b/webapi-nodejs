import { MongoClient, type Collection } from 'mongodb'

import { type Either, left, right } from '@/core/0.domain/utils/either'
import { getVar } from '@/core/0.domain/utils/var'
import { type Logger } from '@/core/1.application/logging/logger'
import { type PersistenceClient } from '@/core/3.infra/persistence/persistence-client'

export type MongodbDataSource = {
  name: string
  database: string
  connectionString: string
}

type Props = {
  dataSource: MongodbDataSource
  logger: Logger
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
    const { logger } = this.props

    try {
      await this.mongoClient.close()

      logger.info('persistence', 'dataSource disconnected')

      return right()
    } catch (error) {
      logger.error('persistence', ['close', error])

      return left(error)
    }
  }

  public async connect (): Promise<Either<Error, void>> {
    const { dataSource, logger } = this.props
    const { connectionString } = dataSource

    try {
      this.mongoClient = await MongoClient.connect(connectionString)

      if (!this.mongoClient) {
        throw new Error('mongodb connection error')
      }

      const { name: dataSource, database } = this.props.dataSource

      logger.info('persistence', `dataSource connected: [${dataSource}] ${database}`)

      return right()
    } catch (error) {
      logger.error('persistence', ['connect', error])

      return left(error)
    }
  }

  public async getCollection (name: string): Promise<Collection> {
    const { database } = this.props.dataSource

    return this.mongoClient.db(database).collection(name)
  }
}
