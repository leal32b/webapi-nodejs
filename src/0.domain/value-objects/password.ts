import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import NotEmptyValidator from '@/0.domain/validators/not-empty-validator'
import NotNullValidator from '@/0.domain/validators/not-null-validator'

export default class Password extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Password> {
    const trueOrError = this.validate(input, [
      new NotEmptyValidator(),
      new NotNullValidator()
    ])

    return trueOrError.applyOnRight(() => new Password(input))
  }
}
