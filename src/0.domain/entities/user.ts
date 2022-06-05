import Entity from '@/0.domain/base/entity'
import { Either } from '@/0.domain/utils/either'
import Email from '@/0.domain/value-objects/email'
import Id from '@/0.domain/value-objects/id'
import Name from '@/0.domain/value-objects/name'
import Password from '@/0.domain/value-objects/password'

type ConstructParams = {
  id: Id
  name: Name
  email: Email
  password: Password
}

type CreateParams = {
  id: string
  name: string
  email: string
  password: string
}

type EntityResult = {
  [key: string]: Error[]
}

export default class User extends Entity {
  private constructor (readonly props: ConstructParams) {
    super()
  }

  static create (params: CreateParams): Either<EntityResult, User> {
    const result = this.validateParams<ConstructParams>({
      id: Id.create(params.id),
      name: Name.create(params.name),
      email: Email.create(params.email),
      password: Password.create(params.password)
    })

    return result.applyOnRight(value => new User(value))
  }
}
