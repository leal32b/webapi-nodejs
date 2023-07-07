import { ObjectId } from 'mongodb'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { UserEntity } from '@/identity/0.domain/entities/user.entity'

export class MongodbUserMapper {
  public static toDomain (user: Record<string, any>): UserAggregate {
    const userEntity = UserEntity.create({
      createdAt: user.createdAt,
      email: user.email,
      emailConfirmed: user.emailConfirmed,
      id: user._id.toString(),
      locale: user.locale,
      name: user.name,
      password: user.password,
      token: user.token,
      updatedAt: user.updatedAt
    })
    const userAggregate = UserAggregate.create(userEntity.value as UserEntity)

    return userAggregate
  }

  public static toPersistence (userAggregate: UserAggregate): Record<string, any> {
    const { createdAt, email, emailConfirmed, id, locale, name, password, token, updatedAt } = userAggregate.aggregateRoot

    return {
      _id: new ObjectId(id),
      createdAt,
      email: email.value,
      emailConfirmed: emailConfirmed.value,
      locale: locale.value,
      name: name.value,
      password: password.value,
      token: token.value,
      updatedAt
    }
  }
}
