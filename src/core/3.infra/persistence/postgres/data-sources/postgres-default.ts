import 'dotenv/config'
import { DataSource } from 'typeorm'

export const postgresDefaultDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_POSTGRES_HOST,
  port: parseInt(process.env.DB_POSTGRES_PORT),
  username: process.env.DB_POSTGRES_USERNAME,
  password: process.env.DB_POSTGRES_PASSWORD,
  database: process.env.DB_POSTGRES_DATABASE,
  logging: false,
  synchronize: false,
  entities: ['src/modules/**/postgres/entities/**/*.ts'],
  migrations: ['src/modules/**/postgres/migrations/**/*.ts']
})
