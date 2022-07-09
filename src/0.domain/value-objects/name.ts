import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import MaxLengthValidator from '@/0.domain/validators/max-length'
import MinLengthValidator from '@/0.domain/validators/min-length'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class Name extends ValueObject<string> {
  private constructor (value: string) {
    super(value)
  }

  static create (input: string): Either<DomainError[], Name> {
    const trueOrError = this.validate(input, [
      new NotEmptyValidator(),
      new MinLengthValidator({ minLength: 6 }),
      new MaxLengthValidator({ maxLength: 32 })
    ])

    return trueOrError.applyOnRight(() => new Name(input))
  }
}
