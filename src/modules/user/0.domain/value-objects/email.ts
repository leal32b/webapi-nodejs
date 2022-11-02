import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { EmailValidator } from '@/core/0.domain/validators/email-validator'
import { MaxLengthValidator } from '@/core/0.domain/validators/max-length-validator'
import { MinLengthValidator } from '@/core/0.domain/validators/min-length-validator'

export class Email extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], Email> {
    const validOrError = this.validate(input, [
      MinLengthValidator.create({ minLength: 12 }),
      MaxLengthValidator.create({ maxLength: 64 }),
      EmailValidator.create()
    ])

    return validOrError.applyOnRight(() => new Email(input))
  }
}
