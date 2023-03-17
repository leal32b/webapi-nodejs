import { type DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { type Either } from '@/core/0.domain/utils/either'
import { NotNullValidator } from '@/core/0.domain/validators/not-null-validator'

export class Language extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], Language> {
    const validOrError = this.validate(input, [
      NotNullValidator.create()
    ])

    return validOrError.applyOnRight(() => new Language(input))
  }
}
