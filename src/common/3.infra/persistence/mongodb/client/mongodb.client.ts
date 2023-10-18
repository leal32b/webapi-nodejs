import { type Connection, type Collection, createConnection } from 'mongoose'

import { right, type Either, left } from '@/common/0.domain/utils/either'
import { getVar } from '@/common/0.domain/utils/var'
import { type Logger } from '@/common/1.application/logging/logger'
import { type PersistenceClient } from '@/common/3.infra/persistence/persistence.client'

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
  private connection: Connection

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
      await this.connection.dropDatabase()

      return right()
    } catch (error) {
      return left(error)
    }
  }

  public async close (): Promise<Either<Error, void>> {
    const { logger } = this.props

    try {
      await this.connection.close()

      logger.info('persistence', 'dataSource disconnected')

      return right()
    } catch (error) {
      logger.error('persistence', ['close', error])

      return left(error)
    }
  }

  public async connect (): Promise<Either<Error, void>> {
    const { dataSource, logger } = this.props

    try {
      this.connection = createConnection(dataSource.connectionString, { dbName: dataSource.database })

      if (!this.connection) {
        throw new Error('mongodb connection error')
      }

      const { name: dataSourceName, database } = this.props.dataSource

      logger.info('persistence', `dataSource connected: [${dataSourceName}] ${database}`)

      return right()
    } catch (error) {
      logger.error('persistence', ['connect', error])

      return left(error)
    }
  }

  public async getCollection (name: string): Promise<Collection> {
    return this.connection.collection(name)
  }
}
