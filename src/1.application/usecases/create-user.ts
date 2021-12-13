import User from '@/0.domain/entities/user'
import CreateUser from '@/0.domain/interfaces/create-user'
import { UserData } from '@/0.domain/types/user'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
export default class CreateUserUsecase implements CreateUser {
  constructor (private readonly props: {
    hasher: Hasher
    createUserRepository: CreateUserRepository
  }) {}

  async create (userData: UserData): Promise<User> {
    const hashedPassword = await this.props.hasher.hash(userData.password)

    const user = await this.props.createUserRepository.create({
      ...userData,
      password: hashedPassword
    })

    return user
  }
}
