import { Connection, createConnection, EntityManager, EntityTarget, Repository } from 'typeorm'

export const PostgresAdapter = {
  connectionName: 'default',
  postgresClient: null as Connection,

  async connect (connectionName: string = this.connectionName): Promise<void> {
    this.connectionName = connectionName
    this.postgresClient = await createConnection(connectionName)
    console.log('postgres connected')
  },

  async close (): Promise<void> {
    await (this.postgresClient as Connection).close()
  },

  async reconnect (): Promise<void> {
    if (!(this.postgresClient as Connection).isConnected) {
      await this.connect()
      console.log('postgres reconnected')
    }
  },

  async getRepository (entity: EntityTarget<any>): Promise<Repository<any>> {
    await this.reconnect()

    return (this.postgresClient as Connection).getRepository(entity)
  },

  getManager (): EntityManager {
    return (this.postgresClient as Connection).manager
  }
}
