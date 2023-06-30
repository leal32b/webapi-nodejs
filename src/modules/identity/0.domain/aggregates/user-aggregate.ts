import { Aggregate } from '@/common/0.domain/base/aggregate'
import { type DomainError } from '@/common/0.domain/base/domain-error'
import { left, type Either, right } from '@/common/0.domain/utils/either'

import { type UserEntity } from '@/identity/0.domain/entities/user-entity'
import { type UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed'
import { type UserPassword } from '@/identity/0.domain/value-objects/user.password'
import { type UserToken } from '@/identity/0.domain/value-objects/user.token'

export class UserAggregate extends Aggregate<UserEntity> {
  public static create (aggregateRoot: UserEntity): Either<DomainError[], UserAggregate> {
    if (!aggregateRoot) {
      return left([])
    }

    return right(new UserAggregate(aggregateRoot))
  }

  public setEmailConfirmed (emailConfirmed: UserEmailConfirmed): void {
    this._aggregateRoot.emailConfirmed = emailConfirmed
  }

  public setPassword (password: UserPassword): void {
    this._aggregateRoot.password = password
  }

  public setToken (token: UserToken): void {
    this._aggregateRoot.token = token
  }

  public get aggregateRoot (): typeof this._aggregateRoot.props {
    return Object.assign({}, this._aggregateRoot.props)
  }
}
