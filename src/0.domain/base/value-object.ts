import DomainError from '@/0.domain/base/domain-error'
import Validator from '@/0.domain/base/validator'
import { Either, left, right } from '@/0.domain/utils/either'

export default abstract class ValueObject {
  static validate (input: any, validators: Validator[]): Either<DomainError[], true> {
    const errors: DomainError[] = []

    validators.forEach(validator => {
      const result = validator.validate(this.name, input)

      if (result.isLeft()) {
        errors.push(result.value)
      }
    })

    if (errors.length > 0) {
      return left(errors)
    }

    return right(true)
  }
}
