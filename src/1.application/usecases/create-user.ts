import { CreateUser, CreateUserModel } from '@/0.domain/interfaces/create-user'
import { UserModel } from '@/0.domain/models/user'
import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import { Hasher } from '@/1.application/interfaces/hasher'

export class CreateUserUsecase implements CreateUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create (userData: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(userData.password)

    const user = await this.createUserRepository.create({
      ...userData,
      password: hashedPassword
    })

    return user
  }
}
