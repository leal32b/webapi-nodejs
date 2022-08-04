import 'dotenv/config'
import { DataSource } from 'typeorm'

export const defaultDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_POSTGRES_HOST,
  port: parseInt(process.env.DB_POSTGRES_PORT),
  username: process.env.DB_POSTGRES_USERNAME,
  password: process.env.DB_POSTGRES_PASSWORD,
  database: process.env.DB_POSTGRES_DATABASE,
  logging: false,
  entities: ['**/postgres/entities/**/*.{js,ts}'],
  migrations: ['**/postgres/migrations/**/*.{js,ts}']
})
