import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Validator } from '@/common/0.domain/base/validator'
import { type Either, left, right } from '@/common/0.domain/utils/either'

export abstract class ValueObject<ValueType> {
  protected constructor (readonly value: ValueType) {}

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
