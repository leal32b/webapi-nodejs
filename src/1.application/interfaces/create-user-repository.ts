import User from '@/0.domain/entities/user'
import { Either } from '@/0.domain/utils/either'
import { UserData } from '@/1.application/types/user-data'

export default interface CreateUserRepository {
  create: (userData: UserData) => Promise<Either<Error, User>>
}
