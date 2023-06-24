import { type DomainError } from '@/common/0.domain/base/domain-error'
import { Entity } from '@/common/0.domain/base/entity'
import { type Either } from '@/common/0.domain/utils/either'
import { type Identifier } from '@/common/0.domain/utils/identifier'

import { Email } from '@/identity/0.domain/value-objects/email'
import { EmailConfirmed } from '@/identity/0.domain/value-objects/email-confirmed'
import { Locale } from '@/identity/0.domain/value-objects/locale'
import { Name } from '@/identity/0.domain/value-objects/name'
import { Password } from '@/identity/0.domain/value-objects/password'
import { Token } from '@/identity/0.domain/value-objects/token'

type Props = {
  email: Email
  emailConfirmed: EmailConfirmed
  locale: Locale
  name: Name
  password: Password
  token: Token
}

export type UserEntityProps = {
  email: string
  locale: string
  name: string
  password: string
  token: string
  emailConfirmed?: boolean
  id?: string
}

export class UserEntity extends Entity<Props> {
  public static create (props: UserEntityProps): Either<DomainError[], UserEntity> {
    const { email, locale, name, password, token, id, emailConfirmed } = props

    const validPropsOrError = this.validateParams<Props>({
      email: Email.create(email),
      emailConfirmed: EmailConfirmed.create(emailConfirmed || false),
      locale: Locale.create(locale),
      name: Name.create(name),
      password: Password.create(password),
      token: Token.create(token)
    })

    return validPropsOrError.applyOnRight(props => new UserEntity(props, id))
  }

  public get email (): Email {
    return this.props.email
  }

  public get emailConfirmed (): EmailConfirmed {
    return this.props.emailConfirmed
  }

  public get id (): Identifier {
    return this.props.id
  }

  public get locale (): Locale {
    return this.props.locale
  }

  public get name (): Name {
    return this.props.name
  }

  public get password (): Password {
    return this.props.password
  }

  public get token (): Token {
    return this.props.token
  }

  public set emailConfirmed (value: EmailConfirmed) {
    this.props.emailConfirmed = value
  }

  public set password (value: Password) {
    this.props.password = value
  }

  public set token (value: Token) {
    this.props.token = value
  }
}
