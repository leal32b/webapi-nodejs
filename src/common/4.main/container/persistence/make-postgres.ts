import { getVar } from '@/common/0.domain/utils/var'
import { PostgresClient } from '@/common/3.infra/persistence/postgres/client/postgres.client'
import { postgresDefaultDataSource } from '@/common/3.infra/persistence/postgres/data-sources/postgres-default.data-source'
import { postgresTestDataSource } from '@/common/3.infra/persistence/postgres/data-sources/postgres-test.data-source'
import { type Postgres } from '@/common/4.main/container/container.type'
import { events } from '@/common/4.main/container/events'
import { logging } from '@/common/4.main/container/logging'

import { PostgresGroupRepository } from '@/identity/3.infra/persistence/postgres/repositories/postgres-group.repository'
import { PostgresUserRepository } from '@/identity/3.infra/persistence/postgres/repositories/postgres-user.repository'

const dataSource = getVar('NODE_ENV') === 'test' ? postgresTestDataSource : postgresDefaultDataSource

export const makePostgres: Postgres = {
  client: PostgresClient.create({
    dataSource,
    logger: logging.logger
  }),
  repositories: {
    groupRepository: PostgresGroupRepository.create(),
    userRepository: PostgresUserRepository.create({ messageBroker: events.messageBroker })
  }
}
