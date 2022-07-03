import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user/user'
import { Either } from '@/0.domain/utils/either'

export default interface CreateUserRepository {
  create: (user: User) => Promise<Either<DomainError, User>>
}
