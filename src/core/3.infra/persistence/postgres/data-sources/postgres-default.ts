import 'dotenv/config'
import { DataSource } from 'typeorm'

export const postgresDefaultDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  logging: false,
  synchronize: false,
  entities: ['src/modules/**/postgres/entities/**/*.ts'],
  migrations: ['src/modules/**/postgres/migrations/**/*.ts']
})
