import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { defaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/default'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { PostgresUserRepository } from '@/user/3.infra/persistence/postgres/repositories/postgres-user-repository'

export const makePostgres = {
  connect: async () => {
    const dataSource = process.env.NODE_ENV === 'test' ? testDataSource() : defaultDataSource()
    await postgres.connect(await dataSource)
  },
  clear: async () => await postgres.client.clearDatabase(),
  close: async () => await postgres.client.close(),
  repositories: {
    userRepository: new PostgresUserRepository()
  }
}
