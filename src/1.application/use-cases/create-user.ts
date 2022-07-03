import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user/user'
import { Either, left, right } from '@/0.domain/utils/either'
import UseCase from '@/1.application/base/use-case'
import InvalidPasswordError from '@/1.application/errors/invalid-password'
import CreateUserRepository from '@/1.application/interfaces/create-user-repository'
import Hasher from '@/1.application/interfaces/hasher'
import { CreateUserData } from '@/1.application/types/create-user-data'

export default class CreateUserUseCase extends UseCase<CreateUserData, User> {
  constructor (private readonly props: {
    hasher: Hasher
    createUserRepository: CreateUserRepository
  }) { super() }

  async execute (createUserData: CreateUserData): Promise<Either<DomainError[], User>> {
    const { hasher, createUserRepository } = this.props
    const { password, passwordRetype } = createUserData

    if (password !== passwordRetype) {
      return left([new InvalidPasswordError('password')])
    }

    const hashedPasswordOrError = await hasher.hash(password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const hashedPassword = hashedPasswordOrError.value
    const userOrError = User.create({ ...createUserData, password: hashedPassword })

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
