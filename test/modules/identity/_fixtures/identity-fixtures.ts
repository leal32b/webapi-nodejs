import { getVar } from '@/common/0.domain/utils/var'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'

import { MongodbGroupFixture } from '~/identity/_fixtures/mongodb/mongodb-group.fixture'
import { MongodbUserFixture } from '~/identity/_fixtures/mongodb/mongodb-user.fixture'
import { PostgresGroupFixture } from '~/identity/_fixtures/postgres/postgres-group.fixture'
import { PostgresUserFixture } from '~/identity/_fixtures/postgres/postgres-user.fixture'

type DatabaseFixtures = {
  groupFixture: PersistenceFixture<any>
  userFixture: PersistenceFixture<any>
}

const makeMongodbFixtures: DatabaseFixtures = {
  groupFixture: MongodbGroupFixture.create(),
  userFixture: MongodbUserFixture.create()
}

const makePostgresFixtures: DatabaseFixtures = {
  groupFixture: PostgresGroupFixture.create(),
  userFixture: PostgresUserFixture.create()
}

const fixtureChoices: Record<string, DatabaseFixtures> = {
  mongodb: makeMongodbFixtures,
  postgres: makePostgresFixtures
}

export const identityFixtures = fixtureChoices[getVar('PERSISTENCE')]
