import { Aggregate } from '@/common/0.domain/base/aggregate'

import { type UserEntity } from '@/identity/0.domain/entities/user.entity'
import { type UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed.value-object'
import { type UserPassword } from '@/identity/0.domain/value-objects/user.password.value-object'
import { type UserToken } from '@/identity/0.domain/value-objects/user.token.value-object'

export class UserAggregate extends Aggregate<UserEntity> {
  public static create (aggregateRoot: UserEntity): UserAggregate {
    return new UserAggregate(aggregateRoot)
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
