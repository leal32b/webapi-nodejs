import { Validator } from '@/core/0.domain/base/validator'
import { InvalidEmailError } from '@/core/0.domain/errors/invalid-email-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'

export class EmailValidator extends Validator<null> {
  public static create (): EmailValidator {
    return new EmailValidator()
  }

  public validate (field: string, input: string): Either<InvalidEmailError, void> {
    const tester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!tester.test(input)) {
      return left(InvalidEmailError.create(field, input))
    }

    return right()
  }
}
