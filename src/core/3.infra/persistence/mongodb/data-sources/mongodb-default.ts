import 'dotenv/config'
import { MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

const HOST = process.env.MONGODB_HOST
const PORT = process.env.MONGODB_PORT
const PERSISTENCE = process.env.MONGODB_DATABASE
const USERNAME = process.env.MONGODB_USERNAME
const PASSWORD = process.env.MONGODB_PASSWORD
const CONNECTION_STRING = process.env.NODE_ENV === 'development'
  ? `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`
  : `mongodb+srv://${USERNAME}:${PASSWORD}@${HOST}/?retryWrites=true&w=majority`

export const mongodbDefaultDataSource: MongodbDataSource = {
  name: 'default',
  database: PERSISTENCE,
  connectionString: CONNECTION_STRING
}
