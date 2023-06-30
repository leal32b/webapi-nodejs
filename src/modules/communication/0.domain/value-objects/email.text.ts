import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { MinLengthValidator } from '@/common/0.domain/validators/min-length-validator'

export class EmailText extends ValueObject<string> {
  static create (input: string): Either<DomainError[], EmailText> {
    const validOrError = this.validate(input, [
      MinLengthValidator.create({ minLength: 6 })
    ])

    return validOrError.applyOnRight(() => new EmailText(input))
  }
}
