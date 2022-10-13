import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { UseCase } from '@/core/1.application/base/use-case'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { NotFoundError } from '@/core/1.application/errors/not-found-error'
import { PasswordMismatchError } from '@/core/1.application/errors/password-mismatch-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { Password } from '@/user/0.domain/value-objects/password'
import { UserRepository } from '@/user/1.application/repositories/user-repository'

export type ChangePasswordData = {
  id: string
  password: string
  passwordRetype: string
}

export type ChangePasswordResultDTO = {
  message: string
}

export class ChangePasswordUseCase extends UseCase<ChangePasswordData, ChangePasswordResultDTO> {
  constructor (private readonly props: {
    userRepository: UserRepository
    hasher: Hasher
  }) { super() }

  async execute (changePasswordData: ChangePasswordData): Promise<Either<DomainError[], ChangePasswordResultDTO>> {
    const { userRepository } = this.props
    const { id, password, passwordRetype } = changePasswordData

    if (password !== passwordRetype) {
      return left([new PasswordMismatchError('password')])
    }

    const userAggregateOrError = await this.getUserAggregate(id)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const passwordOrError = await this.createPassword(password)

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value)
    }

    const newPassword = passwordOrError.value
    userAggregate.password = newPassword
    const updatedOrError = await userRepository.update(userAggregate)

    if (updatedOrError.isLeft()) {
      return left(updatedOrError.value)
    }

    return right({
      message: 'password updated successfully'
    })
  }

  private async getUserAggregate (id: string): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props
    const userAggregateOrError = await userRepository.readById(id)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value

    if (!userAggregate) {
      return left([new NotFoundError('id', id)])
    }

    return right(userAggregate)
  }

  private async createPassword (password: string): Promise<Either<DomainError[], Password>> {
    const { hasher } = this.props

    const hashedPasswordOrError = await hasher.hash(password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const hashedPassword = hashedPasswordOrError.value
    const passwordOrError = Password.create(hashedPassword)

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value)
    }

    return right(passwordOrError.value)
  }
}
