import { faker } from '@faker-js/faker'

import { MongodbFixture } from '@/common/3.infra/persistence/mongodb/base/mongodb.fixture'

import { type MongodbUserEntity } from '@/identity/3.infra/persistence/mongodb/entities/mongodb-user.entity'

export class MongodbUserFixture extends MongodbFixture<MongodbUserEntity> {
  static create (): MongodbFixture<MongodbUserEntity> {
    return new MongodbUserFixture({
      collectionName: 'user',
      createDefault: (): MongodbUserEntity => ({
        createdAt: new Date(),
        email: faker.internet.email(),
        emailConfirmed: false,
        groups: [],
        id: faker.string.hexadecimal({ length: 24 }).slice(2),
        locale: 'en',
        name: faker.person.firstName(),
        password: `$argon2id$v=19$m=4096,t=3,p=1$${faker.string.alphanumeric(16)}$${faker.string.alphanumeric(32)}`,
        token: `${faker.string.alphanumeric(4)}.${faker.string.alphanumeric(4)}.${faker.string.alphanumeric(4)}`,
        updatedAt: new Date()
      })
    })
  }
}
