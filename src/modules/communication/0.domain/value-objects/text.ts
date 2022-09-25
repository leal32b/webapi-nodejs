import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { MinLengthValidator } from '@/core/0.domain/validators/min-length-validator'

export class Text extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Text> {
    const validOrError = this.validate(input, [
      new MinLengthValidator({ minLength: 6 })
    ])

    return validOrError.applyOnRight(() => new Text(input))
  }
}
