import { UserModel } from '@/0.domain/models/user'

export interface CreateUserModel {
  name: string
  email: string
  password: string
}

export interface CreateUser {
  create: (user: CreateUserModel) => Promise<UserModel>
}
