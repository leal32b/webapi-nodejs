import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { defaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/default'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { Persistence } from '@/core/4.main/config/config'
import { PostgresUserRepository } from '@/user/3.infra/persistence/postgres/repositories/postgres-user-repository'

export const postgresPersistence: Persistence = {
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
