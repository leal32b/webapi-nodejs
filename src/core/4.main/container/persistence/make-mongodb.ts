import { getVar } from '@/core/0.domain/utils/var'
import { MongodbClient } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { mongodbDefaultDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/mongodb-default'
import { mongodbTestDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/mongodb-test'
import { type Mongodb } from '@/core/4.main/container/container-types'
import { logging } from '@/core/4.main/container/logging'
import { MongodbUserRepository } from '@/user/3.infra/persistence/mongodb/repositories/mongodb-user-repository'

const dataSource = getVar('NODE_ENV') === 'test' ? mongodbTestDataSource : mongodbDefaultDataSource

export const makeMongodb: Mongodb = {
  client: MongodbClient.create({
    dataSource,
    logger: logging.logger
  }),
  repositories: {
    userRepository: MongodbUserRepository.create({ publisher: null })
  }
}
