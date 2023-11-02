import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { NotEmptyValidator } from '@/common/0.domain/validators/not-empty.validator'
import { NotNullValidator } from '@/common/0.domain/validators/not-null.validator'

export class UserPassword extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], UserPassword> {
    const validOrError = this.validate(input, [
      NotEmptyValidator.create(),
      NotNullValidator.create()
    ])

    return validOrError.applyOnRight(() => new UserPassword(input))
  }
}
