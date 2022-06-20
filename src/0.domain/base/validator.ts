import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export default abstract class Validator {
  abstract validate (field: string, input: any): Either<DomainError, true>
}
