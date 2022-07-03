import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user/user'
import { Either } from '@/0.domain/utils/either'

export default interface ReadUserByEmailRepository {
  read: (email: string) => Promise<Either<DomainError, User>>
}
