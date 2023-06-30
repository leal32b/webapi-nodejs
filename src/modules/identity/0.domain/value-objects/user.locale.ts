import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { LocaleValidator } from '@/common/0.domain/validators/locale-validator'

export class UserLocale extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], UserLocale> {
    const validOrError = this.validate(input, [
      LocaleValidator.create()
    ])

    return validOrError.applyOnRight(() => new UserLocale(input))
  }
}
