import DomainError from '@/0.domain/base/domain-error'
import Entity from '@/0.domain/base/entity'
import { Either } from '@/0.domain/utils/either'
import Email from '@/0.domain/value-objects/email'
import Name from '@/0.domain/value-objects/name'
import Password from '@/0.domain/value-objects/password'

type ConstructParams = {
  email: Email
  name: Name
  password: Password
}

export type CreateParams = {
  email: string
  name: string
  password: string
  id?: string
}

export default class User extends Entity<ConstructParams> {
  private constructor (props: ConstructParams, id?: string) {
    super(props, id)
  }

  static create (params: CreateParams): Either<DomainError[], User> {
    const { email, name, password, id } = params

    const result = this.validateParams<ConstructParams>({
      email: Email.create(email),
      name: Name.create(name),
      password: Password.create(password)
    })

    return result.applyOnRight(value => new User(value, id))
  }
}
