import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { MaxLengthValidator } from '@/common/0.domain/validators/max-length.validator'
import { MinLengthValidator } from '@/common/0.domain/validators/min-length.validator'

export class EmailSubject extends ValueObject<string> {
  static create (input: string): Either<DomainError[], EmailSubject> {
    const validOrError = this.validate(input, [
      MinLengthValidator.create({ minLength: 3 }),
      MaxLengthValidator.create({ maxLength: 64 })
    ])

    return validOrError.applyOnRight(() => new EmailSubject(input))
  }
}
