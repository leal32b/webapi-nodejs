import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type BasePropsType, Entity } from '@/common/0.domain/base/entity'
import { left, type Either, right } from '@/common/0.domain/utils/either'

import { UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed.value-object'
import { UserEmail } from '@/identity/0.domain/value-objects/user.email.value-object'
import { UserLocale } from '@/identity/0.domain/value-objects/user.locale.value-object'
import { UserName } from '@/identity/0.domain/value-objects/user.name.value-object'
import { UserPassword } from '@/identity/0.domain/value-objects/user.password.value-object'
import { UserToken } from '@/identity/0.domain/value-objects/user.token.value-object'

type Props = {
  email: UserEmail
  locale: UserLocale
  name: UserName
  password: UserPassword
  token: UserToken
  emailConfirmed?: UserEmailConfirmed
}

export type UserEntityProps = BasePropsType & {
  email: string
  locale: string
  name: string
  password: string
  token: string
  emailConfirmed?: boolean
}

export class UserEntity extends Entity<Props> {
  public static create (props: UserEntityProps): Either<DomainError[], UserEntity> {
    const { email, locale, name, password, token, emailConfirmed } = props
    const { createdAt, id, updatedAt } = props

    const validPropsOrError = this.validateProps<Props>({
      email: UserEmail.create(email),
      emailConfirmed: UserEmailConfirmed.create(emailConfirmed ?? false),
      locale: UserLocale.create(locale),
      name: UserName.create(name),
      password: UserPassword.create(password),
      token: UserToken.create(token)
    })

    if (validPropsOrError.isLeft()) {
      return left(validPropsOrError.value)
    }

    const validProps = {
      ...validPropsOrError.value,
      createdAt,
      id,
      updatedAt
    }

    return right(new UserEntity(validProps))
  }

  public get email (): UserEmail {
    return this.props.email
  }

  public get emailConfirmed (): UserEmailConfirmed {
    return this.props.emailConfirmed
  }

  public get id (): string {
    return this.props.id
  }

  public get name (): UserName {
    return this.props.name
  }

  public get password (): UserPassword {
    return this.props.password
  }

  public get token (): UserToken {
    return this.props.token
  }

  public set emailConfirmed (value: UserEmailConfirmed) {
    this.props.emailConfirmed = value
    this.updated()
  }

  public set password (value: UserPassword) {
    this.props.password = value
    this.updated()
  }

  public set token (value: UserToken) {
    this.props.token = value
    this.updated()
  }
}
