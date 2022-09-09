import { DomainError } from '@/core/0.domain/base/domain-error'
import { Validator } from '@/core/0.domain/base/validator'
import { Either, left, right } from '@/core/0.domain/utils/either'

export abstract class ValueObject<T> {
  constructor (readonly value: T) {}

  static validate (input: any, validators: Array<Validator<any>>): Either<DomainError[], void> {
    const errors = validators
      .map(validator => validator.validate(this.name, input).value)
      .filter(result => result)

    if (errors.length > 0) {
      return left(errors as DomainError[])
    }

    return right(null)
  }
}
