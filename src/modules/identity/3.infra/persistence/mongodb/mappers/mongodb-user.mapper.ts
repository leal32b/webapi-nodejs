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
    return {
      _id: new ObjectId(userAggregate.aggregateRoot.id),
      createdAt: userAggregate.aggregateRoot.createdAt,
      email: userAggregate.aggregateRoot.email.value,
      emailConfirmed: userAggregate.aggregateRoot.emailConfirmed.value,
      locale: userAggregate.aggregateRoot.locale.value,
      name: userAggregate.aggregateRoot.name.value,
      password: userAggregate.aggregateRoot.password.value,
      token: userAggregate.aggregateRoot.token.value,
      updatedAt: userAggregate.aggregateRoot.updatedAt
    }
  }
}
