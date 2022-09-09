import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { NotEmptyValidator } from '@/core/0.domain/validators/not-empty-validator'
import { NotNullValidator } from '@/core/0.domain/validators/not-null-validator'

export class Token extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Token> {
    const validOrError = this.validate(input, [
      new NotEmptyValidator(),
      new NotNullValidator()
    ])

    return validOrError.applyOnRight(() => new Token(input))
  }
}
