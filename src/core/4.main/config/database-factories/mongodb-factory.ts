import { DatabaseFactories } from '@/core/4.main/config/database-factories'
import { MongodbUserFactory } from '@/user/3.infra/persistence/mongodb/factories/mongodb-user-factory'

export const mongodbFactories: DatabaseFactories = {
  userFactory: MongodbUserFactory.create()
}
