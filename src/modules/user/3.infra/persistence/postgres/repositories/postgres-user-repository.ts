import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { postgres } from '@/core/3.infra/persistence/postgres/client/postgres-client'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

export class PostgresUserRepository implements UserRepository {
  async create (userAggregate: UserAggregate): Promise<Either<DomainError[], void>> {
    try {
      const { email, emailConfirmed, id, name, password, token } = userAggregate
      const repository = await postgres.client.getRepository('PostgresUser')

      const postgresUser = repository.create({
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        id: id.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

      await postgres.client.manager.save(postgresUser)

      return right()
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  async readByEmail (email: string): Promise<Either<DomainError[], UserAggregate>> {
    try {
      const user = await this.readByFilter({ email })

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
      const user = await this.readByFilter({ id })

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
      const { email, emailConfirmed, id, name, password, token } = userAggregate
      const repository = await postgres.client.getRepository('PostgresUser')

      const postgresUser = repository.create({
        email: email.value,
        emailConfirmed: emailConfirmed.value,
        name: name.value,
        password: password.value,
        token: token.value
      })

      const result = await postgres.client.manager.update('PostgresUser', { id: id.value }, postgresUser)

      return right(result)
    } catch (error) {
      return left([new ServerError(error.message, error.stack)])
    }
  }

  private async readByFilter (filter: { [key: string]: any }): Promise<any> {
    const repository = await postgres.client.getRepository('PostgresUser')
    const user = await repository.findOneBy(filter)

    return user
  }
}
