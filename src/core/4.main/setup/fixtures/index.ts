import { DatabaseFixture } from '@/core/3.infra/persistence/database-fixture'
import { makeMongodbFixtures } from '@/core/4.main/setup/fixtures/make-mongodb-fixtures'
import { makePostgresFactories } from '@/core/4.main/setup/fixtures/make-postgres-fixtures'

const PERSISTENCE = process.env.PERSISTENCE

export type DatabaseFixtures = {
  userFixture: DatabaseFixture<any>
}

const fixtureChoices: { [key: string]: DatabaseFixtures } = {
  postgres: makePostgresFactories,
  mongodb: makeMongodbFixtures
}

export const fixtures = fixtureChoices[PERSISTENCE]
