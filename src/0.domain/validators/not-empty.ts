import InvalidParamError from '@/0.domain/errors/invalid-param'
import Validator from '@/0.domain/interfaces/validator'
import { Either, left, right } from '@/0.domain/utils/either'

export default class NotEmptyValidator implements Validator {
  validate (input: string): Either<InvalidParamError, null> {
    if (!input) {
      return left(new InvalidParamError('isEmpty'))
    }

    return right(null)
  }
}
