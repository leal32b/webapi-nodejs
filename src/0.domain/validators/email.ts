import domainError from '@/0.domain/base/domain-error'
import Validator from '@/0.domain/base/validator'
import InvalidEmailError from '@/0.domain/errors/invalid-email'
import { Either, left, right } from '@/0.domain/utils/either'

export default class EmailValidator extends Validator {
  validate (field: string, input: string): Either<domainError, true> {
    const tester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!tester.test(input)) {
      return left(new InvalidEmailError(field, input))
    }

    return right(true)
  }
}
