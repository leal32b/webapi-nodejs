import { DomainError } from '@/core/0.domain/base/domain-error'
import { Validator } from '@/core/0.domain/base/validator'
import { InvalidDateError } from '@/core/0.domain/errors/invalid-date-error'
import { Either, left, right } from '@/core/0.domain/utils/either'

export class DateValidator extends Validator<null> {
  validate (field: string, input: string): Either<DomainError, void> {
    if (!input) {
      return left(new InvalidDateError(field, input))
    }

    const date = new Date(input)

    if (isNaN(date.getTime())) {
      return left(new InvalidDateError(field, input))
    }

    return right()
  }
}
