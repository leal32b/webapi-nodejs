import UserAggregate from '@/0.domain/aggregates/user-aggregate'
import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export default interface UserRepository {
  create: (userAggregate: UserAggregate) => Promise<Either<DomainError, void>>
  readByEmail: (email: string) => Promise<Either<DomainError, UserAggregate>>
  update: (UserAggregate: UserAggregate) => Promise<Either<DomainError, void>>
}
