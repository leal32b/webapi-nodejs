import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { defaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/default'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { Persistence } from '@/core/4.main/config/config'
import { PgUserRepository } from '@/user/3.infra/persistence/postgres/repositories/pg-user-repository'

const DATA_SOURCE = process.env.NODE_ENV === 'test' ? testDataSource : defaultDataSource

export const postgresPersistence: Persistence = {
  connect: async () => await pg.connect(DATA_SOURCE),
  clear: async () => await pg.client.clearDatabase(),
  close: async () => await pg.client.close(),
  repositories: {
    userRepository: new PgUserRepository()
  }
}
