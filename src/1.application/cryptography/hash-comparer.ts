import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export default interface HashComparer {
  compare: (value: string, hash: string) => Promise<Either<DomainError, void>>
}
