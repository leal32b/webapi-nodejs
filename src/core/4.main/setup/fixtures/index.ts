import { getVar } from '@/core/0.domain/utils/var'
import { DatabaseFixture } from '@/core/3.infra/persistence/database-fixture'
import { makeMongodbFixtures } from '@/core/4.main/setup/fixtures/make-mongodb-fixtures'
import { makePostgresFixtures } from '@/core/4.main/setup/fixtures/make-postgres-fixtures'

export type DatabaseFixtures = {
  userFixture: DatabaseFixture<any>
}

const fixtureChoices: { [key: string]: DatabaseFixtures } = {
  postgres: makePostgresFixtures,
  mongodb: makeMongodbFixtures
}

export const fixtures = fixtureChoices[getVar('PERSISTENCE')]
