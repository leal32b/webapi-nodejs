import User from '@/0.domain/entities/user'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import UseCase from '@/1.application/interfaces/use-case'
import { UserData } from '@/1.application/types/user-types'

export default class CreateUserUseCase implements UseCase<UserData, User> {
  constructor (private readonly props: {
    hasher: Hasher
    createUserRepository: CreateUserRepository
  }) {}

  async execute (userData: UserData): Promise<User> {
    const hashedPassword = await this.props.hasher.hash(userData.password)

    const user = await this.props.createUserRepository.create({
      ...userData,
      password: hashedPassword
    })

    return user
  }
}
