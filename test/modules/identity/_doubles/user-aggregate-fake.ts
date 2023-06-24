import { UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { UserEntity } from '@/identity/0.domain/entities/user-entity'

export const makeUserAggregateFake = (): UserAggregate => UserAggregate.create(
  UserEntity.create({
    email: 'any@mail.com',
    id: 'any_id',
    locale: 'en',
    name: 'any_name',
    password: 'hashed_password',
    token: 'any_token'
  }).value as UserEntity
).value as any
