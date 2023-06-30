import { type DomainError } from '@/common/0.domain/base/domain-error'
import { left, type Either, right } from '@/common/0.domain/utils/either'
import { UseCase } from '@/common/1.application/base/use-case'
import { NotFoundError } from '@/common/1.application/errors/not-found-error'

import { type UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed'
import { type UserRepository } from '@/identity/1.application/repositories/user-repository'

type Props = {
  userRepository: UserRepository
}

export type ConfirmEmailData = {
  token: string
}

export type ConfirmEmailResultDTO = {
  message: string
}

export class ConfirmEmailUseCase extends UseCase<Props, ConfirmEmailData, ConfirmEmailResultDTO> {
  public static create (props: Props): ConfirmEmailUseCase {
    return new ConfirmEmailUseCase(props)
  }

  async execute (confirmEmailData: ConfirmEmailData): Promise<Either<DomainError[], ConfirmEmailResultDTO>> {
    const { token } = confirmEmailData
    const userAggregateOrError = await this.readUserAggregate(token)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value
    const emailConfirmedOrError = UserEmailConfirmed.create(true)

    if (emailConfirmedOrError.isLeft()) {
      return left(emailConfirmedOrError.value)
    }

    const emailConfirmed = emailConfirmedOrError.value
    const updatedOrError = await this.updateUserAggregate(userAggregate, emailConfirmed)

    return updatedOrError.applyOnRight(() => ({
      message: 'email confirmed successfully'
    }))
  }

  private async readUserAggregate (token: string): Promise<Either<DomainError[], UserAggregate>> {
    const { userRepository } = this.props
    const userAggregateOrError = await userRepository.readByToken(token)

    if (userAggregateOrError.isLeft()) {
      return left(userAggregateOrError.value)
    }

    const userAggregate = userAggregateOrError.value

    if (!userAggregate) {
      return left([NotFoundError.create('token', token)])
    }

    return right(userAggregate)
  }

  private async updateUserAggregate (userAggregate: UserAggregate, emailConfirmed: UserEmailConfirmed): Promise<Either<DomainError[], void>> {
    const { userRepository } = this.props

    userAggregate.setEmailConfirmed(emailConfirmed)
    const updatedOrError = await userRepository.update(userAggregate)

    return updatedOrError.applyOnRight(() => {})
  }
}
