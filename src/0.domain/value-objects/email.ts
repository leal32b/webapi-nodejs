import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import EmailValidator from '@/0.domain/validators/email'
import MaxLengthValidator from '@/0.domain/validators/max-length'
import MinLengthValidator from '@/0.domain/validators/min-length'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class Email extends ValueObject {
  private constructor (readonly value: string) {
    super()
  }

  static create (input: string): Either<DomainError[], Email> {
    const result = this.validate(input, [
      new NotEmptyValidator(),
      new MinLengthValidator({ minLength: 12 }),
      new MaxLengthValidator({ maxLength: 64 }),
      new EmailValidator()
    ])

    return result.applyOnRight(() => new Email(input))
  }
}
