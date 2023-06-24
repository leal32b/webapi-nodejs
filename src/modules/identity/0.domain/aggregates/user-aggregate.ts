import { Aggregate } from '@/common/0.domain/base/aggregate'
import { type DomainError } from '@/common/0.domain/base/domain-error'
import { left, type Either, right } from '@/common/0.domain/utils/either'

import { type UserEntity } from '@/identity/0.domain/entities/user-entity'
import { type EmailConfirmed } from '@/identity/0.domain/value-objects/email-confirmed'
import { type Password } from '@/identity/0.domain/value-objects/password'
import { type Token } from '@/identity/0.domain/value-objects/token'

export class UserAggregate extends Aggregate<UserEntity> {
  public static create (aggregateRoot: UserEntity): Either<DomainError[], UserAggregate> {
    if (!aggregateRoot) {
      return left([])
    }

    return right(new UserAggregate(aggregateRoot))
  }

  public setEmailConfirmed (emailConfirmed: EmailConfirmed): void {
    this._aggregateRoot.emailConfirmed = emailConfirmed
  }

  public setPassword (password: Password): void {
    this._aggregateRoot.password = password
  }

  public setToken (token: Token): void {
    this._aggregateRoot.token = token
  }

  public get aggregateRoot (): typeof this._aggregateRoot.props {
    return Object.assign({}, this._aggregateRoot.props)
  }
}
