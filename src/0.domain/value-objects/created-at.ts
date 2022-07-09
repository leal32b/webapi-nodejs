import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import DateValidator from '@/0.domain/validators/date'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class CreatedAt extends ValueObject<Date> {
  private constructor (value: Date) {
    super(value)
  }

  static create (input: string): Either<DomainError[], CreatedAt> {
    const trueOrError = this.validate(input, [
      new NotEmptyValidator(),
      new DateValidator()
    ])

    return trueOrError.applyOnRight(() => new CreatedAt(new Date(input)))
  }
}
