import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { NotHtmlValidator } from '@/common/0.domain/validators/not-html-validator'

export class Html extends ValueObject<string> {
  static create (input: string): Either<DomainError[], Html> {
    const validOrError = this.validate(input, [
      NotHtmlValidator.create()
    ])

    return validOrError.applyOnRight(() => new Html(input))
  }
}
