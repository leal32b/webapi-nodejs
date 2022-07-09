import DomainError from '@/0.domain/base/domain-error'
import ValueObject from '@/0.domain/base/value-object'
import { Either } from '@/0.domain/utils/either'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

export default class Token extends ValueObject<string> {
  private constructor (value: string) {
    super(value)
  }

  static create (input: string): Either<DomainError[], Token> {
    const trueOrError = this.validate(input, [
      new NotEmptyValidator()
    ])

    return trueOrError.applyOnRight(() => new Token(input))
  }
}
