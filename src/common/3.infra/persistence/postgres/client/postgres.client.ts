import { type DataSource, type EntityManager, type EntityTarget, type Repository } from 'typeorm'

import { type Either, left, right } from '@/common/0.domain/utils/either'
import { getVar } from '@/common/0.domain/utils/var'
import { type Logger } from '@/common/1.application/logging/logger'
import { type PersistenceClient } from '@/common/3.infra/persistence/persistence.client'

type Props = {
  dataSource: DataSource
  logger: Logger
}

export class PostgresClient implements PersistenceClient {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): PostgresClient {
    return new PostgresClient(props)
  }

  public async clearDatabase (): Promise<Either<Error, void>> {
    const { logger } = this.props

    const isTest = getVar('NODE_ENV') === 'test'

    if (!isTest) {
      return left(new Error('Clear database is allowed only in test environment'))
    }

    try {
      const entities = this.props.dataSource.entityMetadatas

      for await (const entity of entities) {
        await this.props.dataSource.getRepository(entity.name).clear()
        logger.info('persistence', `${entity.name} cleared`)
      }

      return right()
    } catch (error) {
      return left(error)
    }
  }

  public async close (): Promise<Either<Error, void>> {
    const { logger } = this.props

    try {
      await this.props.dataSource.destroy()

      logger.info('persistence', 'dataSource disconnected')

      return right()
    } catch (error) {
      logger.error('persistence', ['close', error])

      return left(error)
    }
  }

  public async connect (): Promise<Either<Error, void>> {
    const { logger } = this.props

    try {
      await this.props.dataSource.initialize()
      const dataSource = this.props.dataSource.name
      const database = this.props.dataSource.options.database as string

      logger.info('persistence', `dataSource connected: [${dataSource}] ${database}`)

      return right()
    } catch (error) {
      logger.error('persistence', ['connect', error])

      return left(error)
    }
  }

  public async getRepository (entity: EntityTarget<any>): Promise<Repository<any>> {
    return this.props.dataSource.getRepository(entity)
  }

  public get manager (): EntityManager {
    return this.props.dataSource.manager
  }
}
