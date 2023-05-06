import 'dotenv/config'
import { DataSource } from 'typeorm'

import { getBooleanVar, getVar } from '@/common/0.domain/utils/var'

import { PostgresUserEntity } from '@/user/3.infra/persistence/postgres/entities/postgres-user-entity'

export const postgresDefaultDataSource = new DataSource({
  type: 'postgres',
  host: getVar('POSTGRES_HOST'),
  port: parseInt(getVar('POSTGRES_PORT')),
  username: getVar('POSTGRES_USERNAME'),
  password: getVar('POSTGRES_PASSWORD'),
  database: getVar('POSTGRES_DATABASE'),
  logging: false,
  synchronize: getBooleanVar('POSTGRES_SYNC'),
  entities: [PostgresUserEntity],
  migrations: ['src/modules/**/postgres/migrations/**/*.ts']
})
