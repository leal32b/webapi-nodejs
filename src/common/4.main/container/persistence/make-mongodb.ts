import { getVar } from '@/common/0.domain/utils/var'
import { MongodbClient } from '@/common/3.infra/persistence/mongodb/client/mongodb.client'
import { mongodbDefaultDataSource } from '@/common/3.infra/persistence/mongodb/data-sources/mongodb-default.data-source'
import { mongodbTestDataSource } from '@/common/3.infra/persistence/mongodb/data-sources/mongodb-test.data-source'
import { type Mongodb } from '@/common/4.main/container/container.type'
import { events } from '@/common/4.main/container/events'
import { logging } from '@/common/4.main/container/logging'

import { MongodbGroupRepository } from '@/identity/3.infra/persistence/mongodb/repositories/mongodb-group.repository'
import { MongodbUserRepository } from '@/identity/3.infra/persistence/mongodb/repositories/mongodb-user.repository'

const dataSource = getVar('NODE_ENV') === 'test' ? mongodbTestDataSource : mongodbDefaultDataSource

export const makeMongodb: Mongodb = {
  client: MongodbClient.create({
    dataSource,
    logger: logging.logger
  }),
  repositories: {
    groupRepository: MongodbGroupRepository.create(),
    userRepository: MongodbUserRepository.create({ messageBroker: events.messageBroker })
  }
}
