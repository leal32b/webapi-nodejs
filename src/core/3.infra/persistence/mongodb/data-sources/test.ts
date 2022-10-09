import 'dotenv/config'
import { MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

export const testDataSource: MongodbDataSource = {
  name: 'test',
  database: `${process.env.DB_MONGODB_DATABASE}_test`,
  connectionString: global.__MONGO_URI__
}
