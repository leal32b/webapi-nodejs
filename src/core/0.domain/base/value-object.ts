import { DomainError } from '@/core/0.domain/base/domain-error'
import { Validator } from '@/core/0.domain/base/validator'
import { Either, left, right } from '@/core/0.domain/utils/either'

export abstract class ValueObject<T> {
  protected constructor (readonly value: T) {}

  public static validate (input: any, validators: Array<Validator<any>>): Either<DomainError[], void> {
    const inputArray = Array.isArray(input) ? input : [input]
    const errors = inputArray
      .map(input => validators
        .map(validator => validator.validate(this.name, input).value)
        .filter(result => result))
      .reduce((acc, curVal) => acc.concat(curVal))

    if (errors.length > 0) {
      return left(errors as DomainError[])
    }

    return right()
  }
}
