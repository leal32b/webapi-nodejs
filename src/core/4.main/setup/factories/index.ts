import { DatabaseFactory } from '@/core/3.infra/persistence/database-factory'
import { makeMongodbFactories } from '@/core/4.main/setup/factories/make-mongodb-factory'
import { makePostgresFactories } from '@/core/4.main/setup/factories/make-postgres-factory'

const PERSISTENCE = process.env.PERSISTENCE

export type DatabaseFactories = {
  userFactory: DatabaseFactory<any>
}

const factoryChoices: { [key: string]: DatabaseFactories } = {
  postgres: makePostgresFactories,
  mongodb: makeMongodbFactories
}

export const factories = factoryChoices[PERSISTENCE]
