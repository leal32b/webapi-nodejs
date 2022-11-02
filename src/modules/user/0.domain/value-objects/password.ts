import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { NotEmptyValidator } from '@/core/0.domain/validators/not-empty-validator'
import { NotNullValidator } from '@/core/0.domain/validators/not-null-validator'

export class Password extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], Password> {
    const validOrError = this.validate(input, [
      NotEmptyValidator.create(),
      NotNullValidator.create()
    ])

    return validOrError.applyOnRight(() => new Password(input))
  }
}
