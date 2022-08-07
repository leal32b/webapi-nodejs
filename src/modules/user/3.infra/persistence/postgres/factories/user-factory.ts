import { faker } from '@faker-js/faker'

import { PgFactory } from '@/core/3.infra/persistence/postgres/base/pg-factory'
import { PgUser } from '@/user/3.infra/persistence/postgres/entities/pg-user'

export class PgUserFactory extends PgFactory<PgUser> {
  static create (): PgFactory<PgUser> {
    return new PgUserFactory({
      repositoryName: 'PgUser',
      createDefault: (): PgUser => ({
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.random.alphaNumeric(12),
        name: faker.name.firstName(),
        password: `$argon2id$v=19$m=4096,t=3,p=1$${faker.random.alphaNumeric(16)}$${faker.random.alphaNumeric(32)}`,
        token: faker.random.alphaNumeric(12)
      })
    })
  }
}
