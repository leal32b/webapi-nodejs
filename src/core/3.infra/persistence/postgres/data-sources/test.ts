import { newDb } from 'pg-mem'
import { DataSource } from 'typeorm'

export const testDataSource = async (): Promise<DataSource> => {
  const mem = newDb()
  mem.public.registerFunction({
    name: 'current_database',
    implementation: () => 'postgres_test'
  })
  mem.public.registerFunction({
    name: 'version',
    implementation: () => '14.5'
  })

  const dataSource = await mem.adapters.createTypeormDataSource({
    type: 'postgres',
    database: 'postgres_test',
    entities: ['**/postgres/entities/**/*.{js,ts}']
  })
  await dataSource.initialize()
  await dataSource.synchronize()

  return dataSource
}
