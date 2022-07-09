import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import EmailValidator from '@/0.domain/validators/email-validator'
import MaxLengthValidator from '@/0.domain/validators/max-length-validator'
import MinLengthValidator from '@/0.domain/validators/min-length-validator'

export default class Email extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Email> {
    const trueOrError = this.validate(input, [
      new MinLengthValidator({ minLength: 12 }),
      new MaxLengthValidator({ maxLength: 64 }),
      new EmailValidator()
    ])

    return trueOrError.applyOnRight(() => new Email(input))
  }
}
