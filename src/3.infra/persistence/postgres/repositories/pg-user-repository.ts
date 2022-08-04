import { UserAggregate } from '@/0.domain/aggregates/user-aggregate'
import { DomainError } from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import { UserRepository } from '@/1.application/repositories/user-repository'
import { ServerError } from '@/2.presentation/errors/server-error'
import { pg } from '@/3.infra/persistence/postgres/client/pg-client'

export class PgUserRepository implements UserRepository {
  async create (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const { email, emailConfirmed, id, name, password, token } = userAggregate.aggregateRoot
      const repository = await pg.client.getRepository('PgUser')

      const pgUser = repository.create({
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        id: id.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

      await pg.client.manager.save(pgUser)

      return right(null)
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  async readByEmail (email: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const repository = await pg.client.getRepository('PgUser')
      const user = await repository.findOneBy({ email })

      if (!user) {
        return right(null)
      }

      const userAggregateOrError = UserAggregate.create(user)

      return userAggregateOrError.applyOnRight(userAggregate => userAggregate)
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  async update (userAggregate: UserAggregate): Promise<Either<DomainError[], any>> {
    try {
      const { email, emailConfirmed, id, name, password, token } = userAggregate.aggregateRoot
      const repository = await pg.client.getRepository('PgUser')

      const pgUser = repository.create({
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

      const result = await pg.client.manager.update('PgUser', { id: id.value }, pgUser)

      return right(result)
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }
}
