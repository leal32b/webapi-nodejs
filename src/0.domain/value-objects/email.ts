import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import MinLengthValidator from '@/0.domain/validators/min-length'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class Email extends ValueObject {
  private constructor (readonly value: string) {
    super()
  }

  static create (input: string): Either<Error[], Email> {
    const result = this.validate(input, [
      new NotEmptyValidator(),
      new MinLengthValidator({ minLength: 12 })
    ])

    return result.applyOnRight(() => new Email(input))
  }
}