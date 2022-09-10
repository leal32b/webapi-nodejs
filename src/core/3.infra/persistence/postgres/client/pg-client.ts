import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm'

import { Either, left, right } from '@/core/0.domain/utils/either'

type constructParams = {
  dataSource: DataSource
}

class PgClient {
  constructor (private readonly props: constructParams) {}

  async connect (message?: string): Promise<Either<Error, void>> {
    try {
      await this.props.dataSource.initialize()
      console.log(message || 'connected to dataSource')

      return right()
    } catch (error) {
      // console.log('connect', error)

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

  async clearDatabase (): Promise<void> {
    await this.reconnect()

    const { database } = this.props.dataSource.options

    if ((database as string).includes('test')) {
      const entities = this.props.dataSource.entityMetadatas

      for await (const entity of entities) {
        await this.props.dataSource.getRepository(entity.name).clear()
      }
    }
  }

  get manager (): EntityManager {
    return this.props.dataSource.manager
  }
}

export const pg = {
  client: null as PgClient,

  async connect (dataSource: DataSource): Promise<Either<Error, void>> {
    this.client = new PgClient({ dataSource })
    const result = await this.client.connect()

    return result
  }
}
