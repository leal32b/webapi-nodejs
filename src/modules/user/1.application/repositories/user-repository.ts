import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either } from '@/core/0.domain/utils/either'
import { type UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'

export interface UserRepository {
  create: (userAggregate: UserAggregate) => Promise<Either<DomainError[], void>>
  readByEmail: (email: string) => Promise<Either<DomainError[], UserAggregate>>
  readById: (id: string) => Promise<Either<DomainError[], UserAggregate>>
  update: (userAggregate: UserAggregate) => Promise<Either<DomainError[], void>>
}
