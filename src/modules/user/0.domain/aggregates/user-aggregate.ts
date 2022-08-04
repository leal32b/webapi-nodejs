import { Aggregate } from '@/core/0.domain/base/aggregate'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either } from '@/core/0.domain/utils/either'
import { UserEntity, UserEntityCreateParams } from '@/modules/user/0.domain/entities/user/user-entity'
import { EmailConfirmed } from '@/modules/user/0.domain/value-objects/email-confirmed'
import { Token } from '@/modules/user/0.domain/value-objects/token'

export class UserAggregate extends Aggregate<UserEntity> {
  static create (params: UserEntityCreateParams): Either<DomainError[], UserAggregate> {
    const userEntityOrError = UserEntity.create(params)

    return userEntityOrError.applyOnRight(userEntity => new UserAggregate({
      aggregateRoot: userEntity
    }))
  }

  setEmailConfirmed (value: boolean): Either<DomainError[], void> {
    const emailConfirmedOrError = EmailConfirmed.create(value)

    return emailConfirmedOrError.applyOnRight(value => {
      this.aggregateRoot.emailConfirmed = value
    })
  }

  setToken (value: string): Either<DomainError[], void> {
    const tokenOrError = Token.create(value)

    return tokenOrError.applyOnRight(value => {
      this.aggregateRoot.token = value
    })
  }
}
