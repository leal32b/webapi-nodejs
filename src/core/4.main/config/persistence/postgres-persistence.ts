import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { defaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/default'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { Persistence } from '@/core/4.main/config/config'
import { PgUserRepository } from '@/user/3.infra/persistence/postgres/repositories/pg-user-repository'

const NODE_ENV = process.env.NODE_ENV

export const postgresPersistence: Persistence = {
  connect: async () => {
    await pg.connect(NODE_ENV === 'test' ? testDataSource : defaultDataSource)
  },
  repositories: {
    userRepository: new PgUserRepository()
  }
}
