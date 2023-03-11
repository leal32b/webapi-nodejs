import { Validator } from '@/core/0.domain/base/validator'
import { NullError } from '@/core/0.domain/errors/null-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'

export class NotNullValidator extends Validator<null> {
  public static create (): NotNullValidator {
    return new NotNullValidator()
  }

  public validate (field: string, input: string): Either<NullError, void> {
    if (input == null) {
      return left(NullError.create(field, input))
    }

    return right()
  }
}
