import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { MaxLengthValidator } from '@/common/0.domain/validators/max-length.validator'
import { MinLengthValidator } from '@/common/0.domain/validators/min-length.validator'

export class GroupName extends ValueObject<string> {
  public static create (input: string): Either<DomainError[], GroupName> {
    const validOrError = this.validate(input, [
      MinLengthValidator.create({ minLength: 2 }),
      MaxLengthValidator.create({ maxLength: 24 })
    ])

    return validOrError.applyOnRight(() => new GroupName(input))
  }
}
