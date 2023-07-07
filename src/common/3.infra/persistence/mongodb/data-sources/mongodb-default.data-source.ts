import 'dotenv/config'
import { getVar } from '@/common/0.domain/utils/var'
import { type MongodbDataSource } from '@/common/3.infra/persistence/mongodb/client/mongodb.client'

const HOST = getVar('MONGODB_HOST')
const PORT = getVar('MONGODB_PORT')
const PERSISTENCE = getVar('MONGODB_DATABASE')
const USERNAME = getVar('MONGODB_USERNAME')
const PASSWORD = getVar('MONGODB_PASSWORD')
const CONNECTION_STRING = getVar('NODE_ENV') === 'development'
  ? `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`
  : `mongodb+srv://${USERNAME}:${PASSWORD}@${HOST}/?retryWrites=true&w=majority`

export const mongodbDefaultDataSource: MongodbDataSource = {
  name: 'default',
  database: PERSISTENCE,
  connectionString: CONNECTION_STRING
}
