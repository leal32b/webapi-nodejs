import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export default interface Hasher {
  hash: (value: string) => Promise<Either<DomainError, string>>
  compare: (hash: string, value: string) => Promise<Either<DomainError, boolean>>
}