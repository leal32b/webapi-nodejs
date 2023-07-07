import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { NotFoundError } from '@/common/1.application/errors/not-found.error'
import { PasswordMismatchError } from '@/common/1.application/errors/password-mismatch.error'

import { type UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { UserPassword } from '@/identity/0.domain/value-objects/user.password.value-object'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'

type Props = {
  userRepository: UserRepository
  hasher: Hasher
}

export type ChangePasswordData = {
  id: string
  password: string
  passwordRetype: string
}

export type ChangePasswordResultDTO = {
  message: string
}

export class ChangePasswordUseCase extends UseCase<Props, ChangePasswordData, ChangePasswordResultDTO> {
  public static create (props: Props): ChangePasswordUseCase {
    return new ChangePasswordUseCase(props)
  }

  public async execute (changePasswordData: ChangePasswordData): Promise<Either<DomainError[], ChangePasswordResultDTO>> {
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

    return updatedOrError.applyOnRight(() => ({
      message: 'password updated successfully'
    }))
  }

  private async hashPassword (password: string): Promise<Either<DomainError[], UserPassword>> {
    const { hasher } = this.props

    const hashedPasswordOrError = await hasher.hash(password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const hashedPassword = hashedPasswordOrError.value
    const passwordOrError = UserPassword.create(hashedPassword)

    return passwordOrError.applyOnRight(password => password)
  }

  private async initialValidation (changePasswordData: ChangePasswordData): Promise<Either<DomainError[], void>> {
    const { password, passwordRetype } = changePasswordData

    if (password !== passwordRetype) {
      return left([PasswordMismatchError.create('password')])
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
      return left([NotFoundError.create('id', id)])
    }

    return right(userAggregate)
  }

  private async updateUserAggregate (userAggregate: UserAggregate, password: UserPassword): Promise<Either<DomainError[], void>> {
    const { userRepository } = this.props

    userAggregate.setPassword(password)
    const updatedOrError = await userRepository.update(userAggregate)

    return updatedOrError.applyOnRight(() => {})
  }
}
