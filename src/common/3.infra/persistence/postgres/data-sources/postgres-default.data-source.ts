import 'dotenv/config'
import { DataSource } from 'typeorm'

import { getBooleanVar, getVar } from '@/common/0.domain/utils/var'

import { PostgresGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-group.entity'
import { PostgresUserGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user-group.entity'
import { PostgresUserEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user.entity'

export const postgresDefaultDataSource = new DataSource({
  type: 'postgres',
  host: getVar('POSTGRES_HOST'),
  port: parseInt(getVar('POSTGRES_PORT')),
  username: getVar('POSTGRES_USERNAME'),
  password: getVar('POSTGRES_PASSWORD'),
  database: getVar('POSTGRES_DATABASE'),
  logging: getBooleanVar('POSTGRES_LOGGING'),
  synchronize: getBooleanVar('POSTGRES_SYNC'),
  entities: [
    PostgresGroupEntity,
    PostgresUserEntity,
    PostgresUserGroupEntity
  ],
  migrations: ['src/modules/**/postgres/migrations/**/*.ts']
})
