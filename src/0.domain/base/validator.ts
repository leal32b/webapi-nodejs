import DomainError from '@/0.domain/base/domain-error'
import { Either } from '@/0.domain/utils/either'

export default abstract class Validator<T> {
  constructor (protected readonly props?: T) {}

  abstract validate (field: string, input: any): Either<DomainError, void>
}
