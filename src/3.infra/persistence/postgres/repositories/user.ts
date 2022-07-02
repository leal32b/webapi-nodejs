import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import ServerError from '@/2.presentation/errors/server'
import { PostgresAdapter } from '@/3.infra/persistence/postgres/adapter/postgres'
import { PgUser } from '@/3.infra/persistence/postgres/entities/user'

export default class UserPostgresRepository implements CreateUserRepository {
  async create (user: User): Promise<Either<DomainError, User>> {
    try {
      const repository = await PostgresAdapter.getRepository(PgUser)
      const pgUser = repository.create(user.getValue())

      await PostgresAdapter.getManager().save(pgUser)

      return right(user)
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }
}
