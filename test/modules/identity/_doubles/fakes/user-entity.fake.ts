import { UserEntity } from '@/identity/0.domain/entities/user.entity'

export const makeUserEntityFake = (): UserEntity => UserEntity.create({
  email: 'any@mail.com',
  locale: 'en',
  name: 'any_name',
  password: 'hashed_password',
  token: 'any_token'
}).value as UserEntity
