import { CreateUserModel } from '@/0.domain/interfaces/create-user'
import { UserModel } from '@/0.domain/models/user'
import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import faker from 'faker'

export class CreateUserRepositoryStub implements CreateUserRepository {
  async create (userData: CreateUserModel): Promise<UserModel> {
    const fakeUser = {
      id: faker.datatype.uuid(),
      name: userData.name,
      email: userData.email,
      password: userData.password
    }

    return await Promise.resolve(fakeUser)
  }
}
