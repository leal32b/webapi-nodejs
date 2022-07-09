import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import NotNullValidator from '@/0.domain/validators/not-null-validator'

export default class EmailConfirmed extends ValueObject<boolean> {
  static create (input: boolean): Either<DomainError[], EmailConfirmed> {
    const trueOrError = this.validate(input, [
      new NotNullValidator()
    ])

    return trueOrError.applyOnRight(() => new EmailConfirmed(input))
  }
}
