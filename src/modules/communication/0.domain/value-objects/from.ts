import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { EmailValidator } from '@/core/0.domain/validators/email-validator'
import { MaxLengthValidator } from '@/core/0.domain/validators/max-length-validator'
import { MinLengthValidator } from '@/core/0.domain/validators/min-length-validator'

export class From extends ValueObject<string> {
  static create (input: string): Either<DomainError[], From> {
    const validOrError = this.validate(input, [
      new MinLengthValidator({ minLength: 12 }),
      new MaxLengthValidator({ maxLength: 64 }),
      new EmailValidator()
    ])

    return validOrError.applyOnRight(() => new From(input))
  }
}
