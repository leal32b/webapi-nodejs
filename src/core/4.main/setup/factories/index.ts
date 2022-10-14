import { DatabaseFactory } from '@/core/3.infra/persistence/database-factory'
import { mongodbFactories } from '@/core/4.main/setup/factories/mongodb-factory'
import { postgresFactories } from '@/core/4.main/setup/factories/postgres-factory'

const DATABASE = process.env.DATABASE

export type DatabaseFactories = {
  userFactory: DatabaseFactory<any>
}

const _factories: { [key: string]: DatabaseFactories } = {
  postgres: postgresFactories,
  mongodb: mongodbFactories
}

export const factories = _factories[DATABASE]
