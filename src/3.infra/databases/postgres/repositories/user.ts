import User from '@/0.domain/entities/user'
import { UserData } from '@/0.domain/types/user-types'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import { PostgresAdapter } from '@/3.infra/databases/postgres/adapter/postgres'
import { PgUser } from '@/3.infra/databases/postgres/entities/user'

export default class UserPostgresRepository implements CreateUserRepository {
  async create (userData: UserData): Promise<User> {
    const user = PostgresAdapter.getRepository(PgUser).create(userData)
    const savedUser = await PostgresAdapter.getManager().save(user)

    return new User({ ...savedUser, id: savedUser.id.toString() })
  }
}
