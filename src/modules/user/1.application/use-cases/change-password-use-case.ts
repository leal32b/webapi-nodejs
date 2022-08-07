import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { UseCase } from '@/core/1.application/base/use-case'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { NotFoundError } from '@/core/1.application/errors/not-found-error'
import { PasswordMismatchError } from '@/core/1.application/errors/password-mismatch-error'
import { UserRepository } from '@/modules/user/1.application/repositories/user-repository'

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
    const { hasher, userRepository } = this.props
    const { id, password, passwordRetype } = changePasswordData

    if (password !== passwordRetype) {
      return left([new PasswordMismatchError('password')])
    }

    const userAggregateOrError = await userRepository.readById(id)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value

    if (!userAggregate) {
      return left([new NotFoundError('id', id)])
    }

    const hashedPasswordOrError = await hasher.hash(password)

    if (hashedPasswordOrError.isLeft()) {
      return left([hashedPasswordOrError.value])
    }

    const hashedPassword = hashedPasswordOrError.value
    userAggregate.setPassword(hashedPassword)
    const updatedOrError = await userRepository.update(userAggregate)

    if (updatedOrError.isLeft()) {
      return left(updatedOrError.value)
    }

    return right({
      message: 'password updated successfully'
    })
  }
}
