import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'

export const makeUserAggregateFake = (): UserAggregate => UserAggregate.create({
  email: 'any@mail.com',
  id: 'any_id',
  language: 'en',
  name: 'any_name',
  password: 'hashed_password',
  token: 'any_token'
}).value as any
