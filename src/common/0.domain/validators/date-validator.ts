import { type DomainError } from '@/common/0.domain/base/domain-error'
import { Validator } from '@/common/0.domain/base/validator'
import { InvalidDateError } from '@/common/0.domain/errors/invalid-date-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'

export class DateValidator extends Validator<null> {
  public static create (): DateValidator {
    return new DateValidator()
  }

  public validate (field: string, input: string): Either<DomainError, void> {
    if (!input) {
      return left(InvalidDateError.create(field, input))
    }

    const date = new Date(input)

    if (isNaN(date.getTime())) {
      return left(InvalidDateError.create(field, input))
    }

    return right()
  }
}
