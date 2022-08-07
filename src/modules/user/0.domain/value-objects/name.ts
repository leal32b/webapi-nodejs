import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { MaxLengthValidator } from '@/core/0.domain/validators/max-length-validator'
import { MinLengthValidator } from '@/core/0.domain/validators/min-length-validator'

export class Name extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Name> {
    const trueOrError = this.validate(input, [
      new MinLengthValidator({ minLength: 3 }),
      new MaxLengthValidator({ maxLength: 32 })
    ])

    return trueOrError.applyOnRight(() => new Name(input))
  }
}
