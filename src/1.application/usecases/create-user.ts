import { CreateUser, CreateUserModel } from '@/0.domain/interfaces/create-user'
import { UserModel } from '@/0.domain/models/user'
import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import { Encrypter } from '@/1.application/interfaces/encryter'

export class CreateUserUsecase implements CreateUser {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create (userData: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.encrypter.encrypt(userData.password)

    const user = await this.createUserRepository.create({
      ...userData,
      password: hashedPassword
    })

    return user
  }
}
