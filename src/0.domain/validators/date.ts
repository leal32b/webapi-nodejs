import domainError from '@/0.domain/base/domain-error'
import Validator from '@/0.domain/base/validator'
import InvalidDateError from '@/0.domain/errors/invalid-date'
import { Either, left, right } from '@/0.domain/utils/either'

export default class DateValidator extends Validator {
  validate (field: string, input: string): Either<domainError, true> {
    if (!input) {
      return left(new InvalidDateError(field, input))
    }

    const date = new Date(input)

    if (isNaN(date.getTime())) {
      return left(new InvalidDateError(field, input))
    }

    return right(true)
  }
}
