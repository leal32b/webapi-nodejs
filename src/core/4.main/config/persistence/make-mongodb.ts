import { mongodb } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'
import { defaultDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/default'
import { testDataSource } from '@/core/3.infra/persistence/mongodb/data-sources/test'
import { MongodbUserRepository } from '@/user/3.infra/persistence/mongodb/repositories/mongodb-user-repository'

export const makeMongodb = {
  connect: async () => {
    const dataSource = process.env.NODE_ENV === 'test' ? testDataSource : defaultDataSource
    await mongodb.connect(dataSource)
  },
  clear: async () => { await mongodb.client.clearDatabase() },
  close: async () => { await mongodb.client.close() },
  repositories: {
    userRepository: new MongodbUserRepository()
  }
}
