import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either } from '@/common/0.domain/utils/either'

export interface Hasher {
  compare: (hash: string, value: string) => Promise<Either<DomainError, boolean>>
  hash: (value: string) => Promise<Either<DomainError, string>>
}
