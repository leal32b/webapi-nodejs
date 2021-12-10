import { User, UserData } from '@/0.domain/types/user'

export interface CreateUserRepository {
  create: (userData: UserData) => Promise<User>
}
