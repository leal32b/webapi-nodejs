import { DomainError } from '@/0.domain/base/domain-error'
import { Validator } from '@/0.domain/base/validator'
import { Either, left, right } from '@/0.domain/utils/either'

export abstract class ValueObject<T> {
  constructor (readonly value: T) {}

  static validate (input: any, validators: Array<Validator<any>>): Either<DomainError[], void> {
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

    return right(null)
  }
}
