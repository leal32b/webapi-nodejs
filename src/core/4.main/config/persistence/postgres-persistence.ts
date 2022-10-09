import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { defaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/default'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { Persistence } from '@/core/4.main/config/config'
import { PostgresUserRepository } from '@/user/3.infra/persistence/postgres/repositories/postgres-user-repository'

const DATA_SOURCE = process.env.NODE_ENV === 'test' ? testDataSource : defaultDataSource

export const postgresPersistence: Persistence = {
  connect: async () => await postgres.connect(DATA_SOURCE),
  clear: async () => await postgres.client.clearDatabase(),
  close: async () => await postgres.client.close(),
  repositories: {
    userRepository: new PostgresUserRepository()
  }
}
