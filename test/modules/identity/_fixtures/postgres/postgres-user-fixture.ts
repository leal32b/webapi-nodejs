import { faker } from '@faker-js/faker'

import { PostgresFixture } from '@/common/3.infra/persistence/postgres/base/postgres-fixture'

import { type PostgresUserEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user-entity'

export class PostgresUserFixture extends PostgresFixture<PostgresUserEntity> {
  static create (): PostgresFixture<PostgresUserEntity> {
    return new PostgresUserFixture({
      createDefault: (): PostgresUserEntity => ({
        createdAt: new Date(),
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.string.alphanumeric(12),
        locale: 'en',
        name: faker.person.firstName(),
        password: `$argon2id$v=19$m=4096,t=3,p=1$${faker.string.alphanumeric(16)}$${faker.string.alphanumeric(32)}`,
        token: faker.string.alphanumeric(12),
        updatedAt: new Date()
      }),
      repositoryName: 'users'
    })
  }
}
