import { faker } from '@faker-js/faker'

import { PostgresFixture } from '@/common/3.infra/persistence/postgres/base/postgres.fixture'

import { type PostgresGroupEntity } from '@/identity/3.infra/persistence/postgres/entities/postgres-group.entity'

export class PostgresGroupFixture extends PostgresFixture<PostgresGroupEntity> {
  static create (): PostgresFixture<PostgresGroupEntity> {
    return new PostgresGroupFixture({
      createDefault: (): PostgresGroupEntity => ({
        createdAt: new Date(),
        id: faker.string.alphanumeric(12),
        name: faker.person.firstName(),
        updatedAt: new Date()
      }),
      repositoryName: 'group'
    })
  }
}
