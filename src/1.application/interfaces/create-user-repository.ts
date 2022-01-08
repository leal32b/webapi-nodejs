import User from '@/0.domain/entities/user'
import { UserData } from '@/1.application/types/user-types'

export default interface CreateUserRepository {
  create: (userData: UserData) => Promise<User>
}
