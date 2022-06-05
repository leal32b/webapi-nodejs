import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import MinLengthValidator from '@/0.domain/validators/min-length'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class Id extends ValueObject {
  private constructor (readonly value: string) {
    super()
  }

  static create (input: string): Either<Error[], Id> {
    const result = this.validate(input, [
      new NotEmptyValidator(),
      new MinLengthValidator({ minLength: 6 })
    ])

    return result.applyOnRight(() => new Id(input))
  }
}
