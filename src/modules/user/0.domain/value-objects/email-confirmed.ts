import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { NotNullValidator } from '@/core/0.domain/validators/not-null-validator'

export class EmailConfirmed extends ValueObject<boolean> {
  public static create (input: boolean): Either<DomainError[], EmailConfirmed> {
    const validOrError = this.validate(input, [
      NotNullValidator.create()
    ])

    return validOrError.applyOnRight(() => new EmailConfirmed(input))
  }
}
