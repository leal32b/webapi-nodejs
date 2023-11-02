import { type DomainError } from '@/common/0.domain/base/domain-error'
import { ValueObject } from '@/common/0.domain/base/value-object'
import { type Either } from '@/common/0.domain/utils/either'
import { HtmlValidator } from '@/common/0.domain/validators/html.validator'

export class EmailHtml extends ValueObject<string> {
  static create (input: string): Either<DomainError[], EmailHtml> {
    const validOrError = this.validate(input, [
      HtmlValidator.create()
    ])

    return validOrError.applyOnRight(() => new EmailHtml(input))
  }
}
