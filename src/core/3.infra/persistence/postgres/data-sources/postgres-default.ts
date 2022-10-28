import 'dotenv/config'
import { DataSource } from 'typeorm'

import { getVar } from '@/core/0.domain/utils/var'

export const postgresDefaultDataSource = new DataSource({
  type: 'postgres',
  host: getVar('POSTGRES_HOST'),
  port: parseInt(getVar('POSTGRES_PORT')),
  username: getVar('POSTGRES_USERNAME'),
  password: getVar('POSTGRES_PASSWORD'),
  database: getVar('POSTGRES_DATABASE'),
  logging: false,
  synchronize: false,
  entities: ['src/modules/**/postgres/entities/**/*.ts'],
  migrations: ['src/modules/**/postgres/migrations/**/*.ts']
})
