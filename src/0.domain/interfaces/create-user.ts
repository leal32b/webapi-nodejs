import User from '@/0.domain/entities/user'
import { UserData } from '@/0.domain/types/user'

export default interface CreateUser {
  create: (userData: UserData) => Promise<User>
}
