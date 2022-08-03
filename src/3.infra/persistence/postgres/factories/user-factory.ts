import { faker } from '@faker-js/faker'

import PgFactory from '@/3.infra/persistence/postgres/base/pg-factory'
import { PgUser } from '@/3.infra/persistence/postgres/entities/pg-user'

export default class PgUserFactory extends PgFactory<PgUser> {
  static create (): PgFactory<PgUser> {
    return new PgUserFactory({
      repositoryName: 'PgUser',
      createDefault: (): PgUser => ({
        email: faker.internet.email(),
        emailConfirmed: false,
        id: faker.random.alphaNumeric(12),
        name: faker.name.firstName(),
        password: faker.random.alphaNumeric(12),
        token: faker.random.alphaNumeric(12)
      })
    })
  }
}
