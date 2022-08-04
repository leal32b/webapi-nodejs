import { DomainError } from '@/0.domain/base/domain-error'
import { Entity } from '@/0.domain/base/entity'
import { Either } from '@/0.domain/utils/either'
import { Identifier } from '@/0.domain/utils/identifier'
import { Email } from '@/0.domain/value-objects/email'
import { EmailConfirmed } from '@/0.domain/value-objects/email-confirmed'
import { Name } from '@/0.domain/value-objects/name'
import { Password } from '@/0.domain/value-objects/password'
import { Token } from '@/0.domain/value-objects/token'

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

  get token (): Token {
    return this.props.token
  }

  set token (value: Token) {
    this.props.token = value
  }
}
