import { Validator } from '@/core/0.domain/base/validator'
import { EmptyError } from '@/core/0.domain/errors/empty-error'
import { Either, left, right } from '@/core/0.domain/utils/either'

export class NotEmptyValidator extends Validator<null> {
  public static create (): NotEmptyValidator {
    return new NotEmptyValidator()
  }

  public validate (field: string, input: string): Either<EmptyError, void> {
    if (input === '') {
      return left(EmptyError.create(field, input))
    }

    return right()
  }
}
