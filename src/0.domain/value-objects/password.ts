import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import MaxLengthValidator from '@/0.domain/validators/max-length'
import MinLengthValidator from '@/0.domain/validators/min-length'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class Password extends ValueObject {
  private constructor (readonly value: string) {
    super()
  }

  static create (input: string): Either<DomainError[], Password> {
    const result = this.validate(input, [
      new NotEmptyValidator(),
      new MinLengthValidator({ minLength: 6 }),
      new MaxLengthValidator({ maxLength: 64 })
    ])

    return result.applyOnRight(() => new Password(input))
  }
}
