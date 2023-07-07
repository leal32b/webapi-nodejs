import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { EmailValidator } from '@/common/0.domain/validators/email.validator'
import { MaxLengthValidator } from '@/common/0.domain/validators/max-length.validator'
import { MinLengthValidator } from '@/common/0.domain/validators/min-length.validator'

export class EmailFrom extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], EmailFrom> {
    const validOrError = this.validate(input, [
      MinLengthValidator.create({ minLength: 12 }),
      MaxLengthValidator.create({ maxLength: 64 }),
      EmailValidator.create()
    ])

    return validOrError.applyOnRight(() => new EmailFrom(input))
  }
}
