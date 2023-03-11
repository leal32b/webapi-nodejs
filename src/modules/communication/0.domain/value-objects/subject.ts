import { type DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { type Either } from '@/core/0.domain/utils/either'
import { MaxLengthValidator } from '@/core/0.domain/validators/max-length-validator'
import { MinLengthValidator } from '@/core/0.domain/validators/min-length-validator'

export class Subject extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Subject> {
    const validOrError = this.validate(input, [
      MinLengthValidator.create({ minLength: 3 }),
      MaxLengthValidator.create({ maxLength: 64 })
    ])

    return validOrError.applyOnRight(() => new Subject(input))
  }
}
