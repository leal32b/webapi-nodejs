import { mongodb } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { defaultDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/default'
import { testDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/test'
import { Persistence } from '@/core/4.main/config/config'
import { MongodbUserRepository } from '@/user/3.infra/persistence/mongodb/repositories/mongodb-user-repository'

const DATA_SOURCE = process.env.NODE_ENV === 'test' ? testDataSource : defaultDataSource
console.log('process.env.NODE_ENV >>>', process.env.NODE_ENV)

export const mongodbPersistence: Persistence = {
  connect: async () => await mongodb.connect(DATA_SOURCE),
  clear: async () => await mongodb.client.clearDatabase(),
  close: async () => await mongodb.client.close(),
  repositories: {
    userRepository: new MongodbUserRepository()
  }
}
