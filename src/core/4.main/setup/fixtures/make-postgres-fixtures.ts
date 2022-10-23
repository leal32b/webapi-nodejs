import { DatabaseFixtures } from '@/core/4.main/setup/fixtures'
import { PostgresUserFixture } from '@/user/3.infra/persistence/postgres/fixtures/postgres-user-fixture'

export const makePostgresFixtures: DatabaseFixtures = {
  userFixture: PostgresUserFixture.create()
}
