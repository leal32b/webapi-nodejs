import { DomainError } from '@/core/0.domain/base/domain-error'
import { Entity } from '@/core/0.domain/base/entity'
import { NullError } from '@/core/0.domain/errors/null-error'
import { Either, left } from '@/core/0.domain/utils/either'
import { Identifier } from '@/core/0.domain/utils/identifier'
import { Email } from '@/user/0.domain/value-objects/email'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'
import { Name } from '@/user/0.domain/value-objects/name'
import { Password } from '@/user/0.domain/value-objects/password'
import { Token } from '@/user/0.domain/value-objects/token'

type ConstructParams = {
  email: Email
  emailConfirmed: EmailConfirmed
  name: Name
  password: Password
  token: Token
}

export type UserEntityCreateParams = {
  email: string
  name: string
  password: string
  token: string
  emailConfirmed?: boolean
  id?: string
}

export class UserEntity extends Entity<ConstructParams> {
  static create (params: UserEntityCreateParams): Either<DomainError[], UserEntity> {
    if (!params) {
      return left([new NullError('params', JSON.stringify(params))])
    }

    const { email, name, password, token, id, emailConfirmed } = params

    const constructParamsOrError = this.validateParams<ConstructParams>({
      email: Email.create(email),
      emailConfirmed: EmailConfirmed.create(emailConfirmed || false),
      name: Name.create(name),
      password: Password.create(password),
      token: Token.create(token)
    })

    return constructParamsOrError.applyOnRight(value => new UserEntity(value, id))
  }

  get email (): Email {
    return this.props.email
  }

  get emailConfirmed (): EmailConfirmed {
    return this.props.emailConfirmed
  }

  set emailConfirmed (value: EmailConfirmed) {
    this.props.emailConfirmed = value
  }

  get id (): Identifier {
    return this.props.id
  }

  get name (): Name {
    return this.props.name
  }

  get password (): Password {
    return this.props.password
  }

  set password (value: Password) {
    this.props.password = value
  }

  get token (): Token {
    return this.props.token
  }

  set token (value: Token) {
    this.props.token = value
  }
}