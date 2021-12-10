import { CreateUser } from '@/0.domain/interfaces/create-user'
import { User, UserData } from '@/0.domain/types/user'
import { CreateUserRepository } from '@/1.application/interfaces/create-user-repository'
import { Hasher } from '@/1.application/interfaces/hasher'

export class CreateUserUsecase implements CreateUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create (userData: UserData): Promise<User> {
    const hashedPassword = await this.hasher.hash(userData.password)

    const user = await this.createUserRepository.create({
      ...userData,
      password: hashedPassword
    })

    return user
  }
}
