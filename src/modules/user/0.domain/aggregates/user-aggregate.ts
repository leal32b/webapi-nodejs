import { AggregateRoot } from '@/core/0.domain/base/aggregate-root'
import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type Identifier } from '@/core/0.domain/utils/identifier'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'
import { Email } from '@/user/0.domain/value-objects/email'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'
import { Locale } from '@/user/0.domain/value-objects/locale'
import { Name } from '@/user/0.domain/value-objects/name'
import { Password } from '@/user/0.domain/value-objects/password'
import { Token } from '@/user/0.domain/value-objects/token'

type Props = {
  email: Email
  emailConfirmed: EmailConfirmed
  locale: Locale
  name: Name
  password: Password
  token: Token
}

export type UserAggregateProps = {
  email: string
  locale: string
  name: string
  password: string
  token: string
  emailConfirmed?: boolean
  id?: string
}

export class UserAggregate extends AggregateRoot<Props> {
  public static create (props: UserAggregateProps): Either<DomainError[], UserAggregate> {
    const { email, locale, name, password, token, id, emailConfirmed } = props

    const constructParamsOrError = this.validateParams<Props>({
      email: Email.create(email),
      emailConfirmed: EmailConfirmed.create(emailConfirmed || false),
      locale: Locale.create(locale),
      name: Name.create(name),
      password: Password.create(password),
      token: Token.create(token)
    })

    if (constructParamsOrError.isLeft()) {
      return left(constructParamsOrError.value)
    }

    const constructParams = constructParamsOrError.value
    const userAggregate = new UserAggregate(constructParams, id)
    userAggregate.addEvent(UserCreatedEvent.create({
      aggregateId: userAggregate.id,
      payload: {
        email: userAggregate.email.value,
        locale: userAggregate.locale.value,
        token: userAggregate.token.value
      }
    }))

    return right(userAggregate)
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
