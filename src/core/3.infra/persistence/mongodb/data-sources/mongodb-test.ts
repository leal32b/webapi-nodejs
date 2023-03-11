import 'dotenv/config'
import { getVar } from '@/core/0.domain/utils/var'
import { type MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

export const mongodbTestDataSource: MongodbDataSource = {
  name: 'test',
  database: `${getVar('MONGODB_DATABASE')}_test`,
  connectionString: getVar('MONGO_URI')
}
