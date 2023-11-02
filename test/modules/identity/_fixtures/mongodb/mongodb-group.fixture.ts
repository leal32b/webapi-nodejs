import { faker } from '@faker-js/faker'

import { MongodbFixture } from '@/common/3.infra/persistence/mongodb/base/mongodb.fixture'

import { type MongodbGroupEntity } from '@/identity/3.infra/persistence/mongodb/entities/mongodb-group.entity'

export class MongodbGroupFixture extends MongodbFixture<MongodbGroupEntity> {
  static create (): MongodbFixture<MongodbGroupEntity> {
    return new MongodbGroupFixture({
      collectionName: 'group',
      createDefault: (): MongodbGroupEntity => ({
        createdAt: new Date(),
        id: faker.string.hexadecimal({ length: 24 }).slice(2),
        name: faker.person.firstName(),
        updatedAt: new Date()
      })
    })
  }
}
