import { faker } from '@faker-js/faker'

import { PostgresFixture } from '@/common/3.infra/persistence/postgres/base/postgres.fixture'

import { type PostgresUserGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-user-group.entity'

export class PostgresUserGroupFixture extends PostgresFixture<PostgresUserGroupEntity> {
  static create (): PostgresFixture<PostgresUserGroupEntity> {
    return new PostgresUserGroupFixture({
      createDefault: (): PostgresUserGroupEntity => ({
        group: null,
        groupId: faker.string.alphanumeric(12),
        user: null,
        userId: faker.string.alphanumeric(12)
      }),
      repositoryName: 'user_group'
    })
  }
}
