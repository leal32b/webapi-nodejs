import { CreateUserModel } from '@/0.domain/interfaces/create-user'
import { UserModel } from '@/0.domain/models/user'

export interface CreateUserRepository {
  create: (userData: CreateUserModel) => Promise<UserModel>
}
