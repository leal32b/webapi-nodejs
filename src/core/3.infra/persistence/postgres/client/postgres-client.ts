import { DataSource, EntityManager, EntityTarget, Repository, CannotConnectAlreadyConnectedError } from 'typeorm'

import { Either, left, right } from '@/core/0.domain/utils/either'

type ConstructParams = {
  dataSource: DataSource
}

class PostgresClient {
  constructor (private readonly props: ConstructParams) {}

  async connect (message?: string): Promise<Either<Error, void>> {
    try {
      await this.props.dataSource.initialize()
      const dataSource = this.props.dataSource.name
      const database = this.props.dataSource.options.database as string

      console.log(message || `connected to ${database} (dataSource: ${dataSource})`)

      return right()
    } catch (error) {
      if (!(error instanceof CannotConnectAlreadyConnectedError)) {
        console.log('connect', error)
      }

      return left(error)
    }
  }

  async reconnect (): Promise<Either<Error, void>> {
    const result = await this.connect('reconnected to dataSource')

    return result
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

  isInitialized (): boolean {
    return this.props.dataSource.isInitialized
  }

  async getRepository (entity: EntityTarget<any>): Promise<Repository<any>> {
    await this.reconnect()

    return this.props.dataSource.getRepository(entity)
  }

  async clearDatabase (): Promise<Either<Error, void>> {
    if (process.env.NODE_ENV !== 'test') {
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

export const postgres = {
  client: null as PostgresClient,

  async connect (dataSource: DataSource): Promise<Either<Error, void>> {
    this.client = new PostgresClient({ dataSource })
    const result = await this.client.connect()

    return result
  }
}
