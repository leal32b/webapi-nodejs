import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm'

type constructParams = {
  dataSource: DataSource
}

class PgClient {
  constructor (private readonly props: constructParams) {}

  async connect (message?: string): Promise<void> {
    if (this.props.dataSource.isInitialized) {
      return
    }

    try {
      await this.props.dataSource.initialize()

      console.log(message || 'connected to dataSource')
    } catch (error) {
      console.log(error)
    }
  }

  async reconnect (): Promise<void> {
    this.connect('reconnected to dataSource')
  }

  async close (): Promise<void> {
    await this.props.dataSource.destroy()

    console.log('disconnected from dataSource')
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

    if (!(database as string).includes('test')) {
      return
    }

    const entities = this.props.dataSource.entityMetadatas

    for await (const entity of entities) {
      await this.props.dataSource.getRepository(entity.name).clear()
    }
  }

  get manager (): EntityManager {
    return this.props.dataSource.manager
  }
}

const pg = {
  client: null as PgClient,

  async connect (dataSource: DataSource): Promise<void> {
    this.client = new PgClient({ dataSource })
    await this.client.connect()
  }
}

export default pg
