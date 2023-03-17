import { Validator } from '@/core/0.domain/base/validator'
import { InvalidLocaleError } from '@/core/0.domain/errors/invalid-locale-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'

export class LocaleValidator extends Validator<null> {
  public static create (): LocaleValidator {
    return new LocaleValidator()
  }

  public validate (field: string, input: string): Either<InvalidLocaleError, void> {
    const tester = /^[a-z]{2}?([_][A-Z]{2})?$/

    if (!tester.test(input)) {
      return left(InvalidLocaleError.create(field, input))
    }

    return right()
  }
}
