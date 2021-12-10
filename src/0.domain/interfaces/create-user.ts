import { User, UserData } from '@/0.domain/types/user'

export interface CreateUser {
  create: (userData: UserData) => Promise<User>
}
