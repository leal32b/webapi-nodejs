import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import UseCase from '@/1.application/base/use-case'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import { UserData } from '@/1.application/types/user-data'

export default class CreateUserUseCase extends UseCase<UserData, User> {
  constructor (private readonly props: {
    hasher: Hasher
    createUserRepository: CreateUserRepository
  }) { super() }

  async execute (userData: UserData): Promise<Either<DomainError[], User>> {
    const { hasher, createUserRepository } = this.props
    const hashedPasswordOrError = await hasher.hash(userData.password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const hashedPassword = hashedPasswordOrError.value
    const userOrError = User.create({ ...userData, password: hashedPassword })

    if (userOrError.isLeft()) {
      return userOrError
    }

    const user = userOrError.value
    const createdUserOrError = await createUserRepository.create(user)

    if (createdUserOrError.isLeft()) {
      return left([createdUserOrError.value])
    }

    return right(createdUserOrError.value)
  }
}
