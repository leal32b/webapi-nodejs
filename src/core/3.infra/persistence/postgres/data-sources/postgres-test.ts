import { newDb } from 'pg-mem'

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
  entities: ['src/modules/**/postgres/entities/**/*.ts']
})
