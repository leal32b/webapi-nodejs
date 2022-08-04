import { Validator } from '@/0.domain/base/validator'
import { NullError } from '@/0.domain/errors/null-error'
import { Either, left, right } from '@/0.domain/utils/either'

export class NotNullValidator extends Validator<null> {
  validate (field: string, input: string): Either<NullError, void> {
    if (input == null) {
      return left(new NullError(field, input))
    }

    return right(null)
  }
}
