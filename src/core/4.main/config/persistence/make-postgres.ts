import { PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { postgresDefaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/postgres-default'
import { postgresTestDataSource } from '@/core/3.infra/persistence/postgres/data-sources/postgres-test'
import { Postgres } from '@/core/4.main/config/types'
import { PostgresUserRepository } from '@/user/3.infra/persistence/postgres/repositories/postgres-user-repository'

const dataSource = process.env.NODE_ENV === 'test' ? postgresTestDataSource : postgresDefaultDataSource

export const makePostgres: Postgres = {
  client: new PostgresClient({ dataSource }),
  repositories: {
    userRepository: new PostgresUserRepository()
  }
}
