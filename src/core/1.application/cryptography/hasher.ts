import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either } from '@/core/0.domain/utils/either'

export interface Hasher {
  hash: (value: string) => Promise<Either<DomainError, string>>
  compare: (hash: string, value: string) => Promise<Either<DomainError, boolean>>
}
