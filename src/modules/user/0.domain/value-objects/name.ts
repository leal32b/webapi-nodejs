import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { MaxLengthValidator } from '@/core/0.domain/validators/max-length-validator'
import { MinLengthValidator } from '@/core/0.domain/validators/min-length-validator'

export class Name extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], Name> {
    const validOrError = this.validate(input, [
      MinLengthValidator.create({ minLength: 3 }),
      MaxLengthValidator.create({ maxLength: 32 })
    ])

    return validOrError.applyOnRight(() => new Name(input))
  }
}
