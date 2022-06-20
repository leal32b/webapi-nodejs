import Validator from '@/0.domain/base/validator'
import NotEmptyError from '@/0.domain/errors/not-empty'
import { Either, left, right } from '@/0.domain/utils/either'

export default class NotEmptyValidator extends Validator {
  validate (field: string, input: string): Either<NotEmptyError, true> {
    if (!input) {
      return left(new NotEmptyError(field, input))
    }

    return right(true)
  }
}
