import 'dotenv/config'
import { MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

export const mongodbTestDataSource: MongodbDataSource = {
  name: 'test',
  database: `${process.env.MONGODB_DATABASE}_test`,
  connectionString: global.__MONGO_URI__
}
