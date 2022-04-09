import User from '@/0.domain/entities/user'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import { UserData } from '@/1.application/types/user-types'
import { PostgresAdapter } from '@/3.infra/databases/postgres/adapter/postgres'
import { PgUser } from '@/3.infra/databases/postgres/entities/user'

export default class UserPostgresRepository implements CreateUserRepository {
  async create (userData: UserData): Promise<User> {
    const repository = await PostgresAdapter.getRepository(PgUser)
    const user = repository.create(userData)
    const savedUser = await PostgresAdapter.getManager().save(user)

    return new User({ ...savedUser, id: savedUser.id.toString() })
  }
}