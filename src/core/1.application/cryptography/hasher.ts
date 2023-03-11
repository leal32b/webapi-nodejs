import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either } from '@/core/0.domain/utils/either'

export interface Hasher {
  compare: (hash: string, value: string) => Promise<Either<DomainError, boolean>>
  hash: (value: string) => Promise<Either<DomainError, string>>
}
