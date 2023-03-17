import { type DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { type Either } from '@/core/0.domain/utils/either'
import { NotNullValidator } from '@/core/0.domain/validators/not-null-validator'

export class Locale extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], Locale> {
    const validOrError = this.validate(input, [
      NotNullValidator.create()
    ])

    return validOrError.applyOnRight(() => new Locale(input))
  }
}
