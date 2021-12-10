import faker from 'faker'

import { User, UserData } from '@/0.domain/types/user'
import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'

export class CreateUserRepositoryStub implements CreateUserRepository {
  async create (userData: UserData): Promise<User> {
    const fakeUser = {
      id: faker.datatype.uuid(),
      name: userData.name,
      email: userData.email,
      password: userData.password
    }

    return await Promise.resolve(fakeUser)
  }
}
