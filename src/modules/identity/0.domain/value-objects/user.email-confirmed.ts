import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { NotNullValidator } from '@/common/0.domain/validators/not-null-validator'

export class UserEmailConfirmed extends ValueObject<boolean> {
  public static create (input: boolean): Either<DomainError[], UserEmailConfirmed> {
    const validOrError = this.validate(input, [
      NotNullValidator.create()
    ])

    return validOrError.applyOnRight(() => new UserEmailConfirmed(input))
  }
}
