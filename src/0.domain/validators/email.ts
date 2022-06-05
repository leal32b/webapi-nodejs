import InvalidParamError from '@/0.domain/errors/invalid-param'
import Validator from '@/0.domain/interfaces/validator'
import { Either, left, right } from '@/0.domain/utils/either'

export default class EmailValidator implements Validator {
  validate (input: string): Either<InvalidParamError, null> {
    const tester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!tester.test(input)) {
      return left(new InvalidParamError('invalid email format'))
    }

    return right(null)
  }
}
