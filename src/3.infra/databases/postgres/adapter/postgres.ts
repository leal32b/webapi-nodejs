import { Connection, createConnection, EntityManager, EntityTarget, Repository } from 'typeorm'

export const PostgresAdapter = {
  postgresClient: null as Connection,

  async connect (): Promise<void> {
    this.postgresClient = await createConnection()
    console.log('postgres connected')
  },

  async close (): Promise<void> {
    await (this.postgresClient as Connection).close()
  },

  getRepository (entity: EntityTarget<any>): Repository<any> {
    return (this.postgresClient as Connection).getRepository(entity)
  },

  getManager (): EntityManager {
    return (this.postgresClient as Connection).manager
  }
}
