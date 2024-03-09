import { getVar } from '@/common/0.domain/utils/var'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'

import { PostgresGroupFixture } from '~/identity/_fixtures/postgres/postgres-group.fixture'
import { PostgresUserFixture } from '~/identity/_fixtures/postgres/postgres-user.fixture'

type DatabaseFixtures = {
  groupFixture: PersistenceFixture<any>
  userFixture: PersistenceFixture<any>
}

const makePostgresFixtures: DatabaseFixtures = {
  groupFixture: PostgresGroupFixture.create(),
  userFixture: PostgresUserFixture.create()
}

const fixtureChoices: Record<string, DatabaseFixtures> = {
  postgres: makePostgresFixtures
}

export const identityFixtures = fixtureChoices[getVar('PERSISTENCE')]
