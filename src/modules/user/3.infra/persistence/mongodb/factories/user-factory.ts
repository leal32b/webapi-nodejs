import { faker } from '@faker-js/faker'

import { MongodbFactory } from '@/core/3.infra/persistence/mongodb/base/mongodb-factory'
import { MongodbUser } from '@/user/3.infra/persistence/mongodb/entities/mongodb-user'

export class MongodbUserFactory extends MongodbFactory<MongodbUser> {
  static create (): MongodbFactory<MongodbUser> {
    return new MongodbUserFactory({
      collectionName: 'users',
      createDefault: (): MongodbUser => ({
        id: faker.random.alphaNumeric(12),
        email: faker.internet.email(),
        emailConfirmed: false,
        name: faker.name.firstName(),
        password: `$argon2id$v=19$m=4096,t=3,p=1$${faker.random.alphaNumeric(16)}$${faker.random.alphaNumeric(32)}`,
        token: faker.random.alphaNumeric(12)
      })
    })
  }
}
