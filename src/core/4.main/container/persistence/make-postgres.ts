import { getVar } from '@/core/0.domain/utils/var'
import { PostgresClient } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { postgresDefaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/postgres-default'
import { postgresTestDataSource } from '@/core/3.infra/persistence/postgres/data-sources/postgres-test'
import { type Postgres } from '@/core/4.main/container/container-types'
import { logging } from '@/core/4.main/container/logging'
import { PostgresUserRepository } from '@/user/3.infra/persistence/postgres/repositories/postgres-user-repository'

const dataSource = getVar('NODE_ENV') === 'test' ? postgresTestDataSource : postgresDefaultDataSource

export const makePostgres: Postgres = {
  client: PostgresClient.create({
    dataSource,
    logger: logging.logger
  }),
  repositories: {
    userRepository: PostgresUserRepository.create({ publisher: null })
  }
}
