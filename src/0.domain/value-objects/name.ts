import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import MaxLengthValidator from '@/0.domain/validators/max-length-validator'
import MinLengthValidator from '@/0.domain/validators/min-length-validator'

export default class Name extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Name> {
    const trueOrError = this.validate(input, [
      new MinLengthValidator({ minLength: 6 }),
      new MaxLengthValidator({ maxLength: 32 })
    ])

    return trueOrError.applyOnRight(() => new Name(input))
  }
}
