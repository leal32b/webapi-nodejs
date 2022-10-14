import { DatabaseFactories } from '@/core/4.main/config/persistence/factories'
import { MongodbUserFactory } from '@/user/3.infra/persistence/mongodb/factories/mongodb-user-factory'

export const mongodbFactories: DatabaseFactories = {
  userFactory: MongodbUserFactory.create()
}
