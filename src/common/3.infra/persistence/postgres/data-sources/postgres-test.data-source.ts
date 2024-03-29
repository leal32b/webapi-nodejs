import { newDb } from 'pg-mem'

import { PostgresGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-group.entity'
import { PostgresUserGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user-group.entity'
import { PostgresUserEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user.entity'

const mem = newDb()
mem.public.registerFunction({
  name: 'current_database',
  implementation: () => 'postgres_test'
})
mem.public.registerFunction({
  name: 'version',
  implementation: () => '14.5'
})

export const postgresTestDataSource = mem.adapters.createTypeormDataSource({
  type: 'postgres',
  database: 'postgres_test',
  synchronize: true,
  entities: [
    PostgresGroupEntity,
    PostgresUserEntity,
    PostgresUserGroupEntity
  ]
})
