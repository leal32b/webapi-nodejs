import { type DatabaseFixtures } from '@/core/4.main/setup/fixtures'
import { MongodbUserFixture } from '@/user/3.infra/persistence/mongodb/fixtures/mongodb-user-fixture'

export const makeMongodbFixtures: DatabaseFixtures = {
  userFixture: MongodbUserFixture.create()
}
