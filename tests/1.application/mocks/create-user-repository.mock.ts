import faker from 'faker'

import User from '@/0.domain/entities/user'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import { UserData } from '@/1.application/types/user-types'

export default class CreateUserRepositoryStub implements CreateUserRepository {
  async create (userData: UserData): Promise<User> {
    const fakeUser = {
      id: faker.datatype.uuid(),
      name: userData.name,
      email: userData.email,
      password: userData.password
    }

    return new User(fakeUser)
  }
}
