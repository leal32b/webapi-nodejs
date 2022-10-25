import { DataSource, EntityManager, EntityTarget, Repository, CannotConnectAlreadyConnectedError } from 'typeorm'

import { Either, left, right } from '@/core/0.domain/utils/either'
import { getVar } from '@/core/0.domain/utils/var'
import { PersistenceClient } from '@/core/3.infra/persistence/persistence-client'

type ConstructParams = {
  dataSource: DataSource
}

export class PostgresClient implements PersistenceClient {
  constructor (private readonly props: ConstructParams) {}

  async connect (): Promise<Either<Error, void>> {
    try {
      await this.props.dataSource.initialize()
      const dataSource = this.props.dataSource.name
      const database = this.props.dataSource.options.database as string

      console.log(`connected to ${database} (dataSource: ${dataSource})`)

      return right()
    } catch (error) {
      if (!(error instanceof CannotConnectAlreadyConnectedError)) {
        console.log('connect', error)
      }

      return left(error)
    }
  }

  async close (): Promise<Either<Error, void>> {
    try {
      await this.props.dataSource.destroy()
      console.log('disconnected from dataSource')

      return right()
    } catch (error) {
      console.log('close', error)

      return left(error)
    }
  }

  async getRepository (entity: EntityTarget<any>): Promise<Repository<any>> {
    return this.props.dataSource.getRepository(entity)
  }

  async clearDatabase (): Promise<Either<Error, void>> {
    const isTest = getVar('NODE_ENV') === 'test'

    if (!isTest) {
      return left(new Error('Clear database is allowed only in test environment'))
    }

    try {
      const entities = this.props.dataSource.entityMetadatas

      for await (const entity of entities) {
        await this.props.dataSource.getRepository(entity.name).clear()
      }

      return right()
    } catch (error) {
      return left(error)
    }
  }

  get manager (): EntityManager {
    return this.props.dataSource.manager
  }
}
