import 'dotenv/config'
import { MongodbDataSource } from '@/core/3.infra/persistence/mongodb/client/mongodb-client'

const HOST = process.env.DB_MONGODB_HOST
const PORT = process.env.DB_MONGODB_PORT
const DATABASE = process.env.DB_MONGODB_DATABASE
const USERNAME = process.env.DB_MONGODB_USERNAME
const PASSWORD = process.env.DB_MONGODB_PASSWORD
const CONNECTION_STRING = process.env.NODE_ENV === 'development'
  ? `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`
  : `mongodb+srv://${USERNAME}:${PASSWORD}@${HOST}/?retryWrites=true&w=majority`

export const defaultDataSource: MongodbDataSource = {
  name: 'default',
  database: DATABASE,
  connectionString: CONNECTION_STRING
}
