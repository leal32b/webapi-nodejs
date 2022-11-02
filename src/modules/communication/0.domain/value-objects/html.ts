import { DomainError } from '@/core/0.domain/base/domain-error'
import { ValueObject } from '@/core/0.domain/base/value-object'
import { Either } from '@/core/0.domain/utils/either'
import { NotHtmlValidator } from '@/core/0.domain/validators/not-html-validator'

export class Html extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Html> {
    const validOrError = this.validate(input, [
      NotHtmlValidator.create()
    ])

    return validOrError.applyOnRight(() => new Html(input))
  }
}
