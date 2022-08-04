import { Validator } from '@/0.domain/base/validator'
import { EmptyError } from '@/0.domain/errors/empty-error'
import { Either, left, right } from '@/0.domain/utils/either'

export class NotEmptyValidator extends Validator<null> {
  validate (field: string, input: string): Either<EmptyError, void> {
    if (input === '') {
      return left(new EmptyError(field, input))
    }

    return right(null)
  }
}
