import User from '@/0.domain/entities/user'
import { UserData } from '@/0.domain/types/user'

export default interface CreateUserRepository {
  create: (userData: UserData) => Promise<User>
}
