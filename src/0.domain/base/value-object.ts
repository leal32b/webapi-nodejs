import Validator from '@/0.domain/interfaces/validator'
import { Either, left, right } from '@/0.domain/utils/either'

export default abstract class ValueObject {
  static validate (value: any, validators: Validator[]): Either<Error[], null> {
    const errors = []

    validators.forEach(validator => {
      const result = validator.validate(value)

      if (result.isLeft()) {
        errors.push(result.value)
      }
    })

    if (errors.length) {
      return left(errors)
    }

    return right(null)
  }
}
