
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { UserAggregate } from '@/modules/user/0.domain/aggregates/user-aggregate'
import { UserRepository } from '@/modules/user/1.application/repositories/user-repository'

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

  async readById (id: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const repository = await pg.client.getRepository('PgUser')
      const user = await repository.findOneBy({ id })

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
