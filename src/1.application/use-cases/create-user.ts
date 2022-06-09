import User from '@/0.domain/entities/user'
import { Either, left } from '@/0.domain/utils/either'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import UseCase from '@/1.application/interfaces/use-case'
import { UserData } from '@/1.application/types/user-data'

export default class CreateUserUseCase implements UseCase<UserData, User> {
  constructor (private readonly props: {
    hasher: Hasher
    createUserRepository: CreateUserRepository
  }) {}

  async execute (userData: UserData): Promise<Either<Error, User>> {
    const { hasher, createUserRepository } = this.props
    const hashedPassword = await hasher.hash(userData.password)

    if (hashedPassword.isLeft()) {
      return left(hashedPassword.value)
    }

    const user = await createUserRepository.create({
      ...userData,
      password: hashedPassword.value
    })

    return user.applyOnRight(user => user)
  }
}
