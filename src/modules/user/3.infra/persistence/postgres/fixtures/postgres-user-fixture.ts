import { faker } from '@faker-js/faker'

import { PostgresFixture } from '@/core/3.infra/persistence/postgres/base/postgres-fixture'
import { PostgresUserEntity } from '@/user/3.infra/persistence/postgres/entities/postgres-user-entity'

export class PostgresUserFixture extends PostgresFixture<PostgresUserEntity> {
  static create (): PostgresFixture<PostgresUserEntity> {
    return new PostgresUserFixture({
      createDefault: (): PostgresUserEntity => ({
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.random.alphaNumeric(12),
        name: faker.name.firstName(),
        password: `$argon2id$v=19$m=4096,t=3,p=1$${faker.random.alphaNumeric(16)}$${faker.random.alphaNumeric(32)}`,
        token: faker.random.alphaNumeric(12)
      }),
      repositoryName: 'users'
    })
  }
}
