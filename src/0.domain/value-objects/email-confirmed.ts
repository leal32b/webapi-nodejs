import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class EmailConfirmed extends ValueObject<boolean> {
  private constructor (value: boolean) {
    super(value)
  }

  static create (input: boolean): Either<DomainError[], EmailConfirmed> {
    const trueOrError = this.validate(input, [
      new NotEmptyValidator()
    ])

    return trueOrError.applyOnRight(() => new EmailConfirmed(input))
  }
}
