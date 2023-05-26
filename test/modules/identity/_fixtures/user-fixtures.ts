import { getVar } from '@/common/0.domain/utils/var'
import { type DatabaseFixture } from '@/common/3.infra/persistence/persistence-fixture'

import { MongodbUserFixture } from '~/identity/_fixtures/mongodb/mongodb-user-fixture'
import { PostgresUserFixture } from '~/identity/_fixtures/postgres/postgres-user-fixture'

type DatabaseFixtures = {
  userFixture: DatabaseFixture<any>
}

const makeMongodbFixtures: DatabaseFixtures = {
  userFixture: MongodbUserFixture.create()
}

const makePostgresFixtures: DatabaseFixtures = {
  userFixture: PostgresUserFixture.create()
}

const fixtureChoices: Record<string, DatabaseFixtures> = {
  mongodb: makeMongodbFixtures,
  postgres: makePostgresFixtures
}

export const userFixtures = fixtureChoices[getVar('PERSISTENCE')]
