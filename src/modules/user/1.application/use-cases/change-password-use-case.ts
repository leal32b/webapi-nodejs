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
    const { id, password } = changePasswordData

    const validOrError = await this.initialValidation(changePasswordData)

    if (validOrError.isLeft()) {
      return left(validOrError.value)
    }

    const userAggregateOrError = await this.readUserAggregate(id)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const passwordOrError = await this.hashPassword(password)

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value)
    }

    const newPassword = passwordOrError.value
    const updatedOrError = await this.updateUserAggregate(userAggregate, newPassword)

    if (updatedOrError.isLeft()) {
      return left(updatedOrError.value)
    }

    return right({
      message: 'password updated successfully'
    })
  }

  private async initialValidation (changePasswordData: ChangePasswordData): Promise<Either<DomainError[], void>> {
    const { password, passwordRetype } = changePasswordData

    if (password !== passwordRetype) {
      return left([new PasswordMismatchError('password')])
    }

    return right()
  }

  private async readUserAggregate (id: string): Promise<Either<DomainError[], UserAggregate>> {
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

  private async hashPassword (password: string): Promise<Either<DomainError[], Password>> {
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

  private async updateUserAggregate (userAggregate: UserAggregate, password: Password): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props

    userAggregate.password = password
    const updatedOrError = await userRepository.update(userAggregate)

    if (updatedOrError.isLeft()) {
      return left(updatedOrError.value)
    }

    return right()
  }
}
