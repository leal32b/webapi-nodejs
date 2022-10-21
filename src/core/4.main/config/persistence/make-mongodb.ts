import { MongodbClient } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { mongodbDefaultDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/mongodb-default'
import { mongodbTestDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/mongodb-test'
import { Mongodb } from '@/core/4.main/config/types'
import { MongodbUserRepository } from '@/user/3.infra/persistence/mongodb/repositories/mongodb-user-repository'

const dataSource = process.env.NODE_ENV === 'test' ? mongodbTestDataSource : mongodbDefaultDataSource

export const makeMongodb: Mongodb = {
  client: new MongodbClient({ dataSource }),
  repositories: {
    userRepository: new MongodbUserRepository()
  }
}
