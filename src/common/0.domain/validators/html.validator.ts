import { Validator } from '@/common/0.domain/base/validator'
import { NotHtmlError } from '@/common/0.domain/errors/not-html.error'
import { type Either, left, right } from '@/common/0.domain/utils/either'

export class HtmlValidator extends Validator<null> {
  public static create (): HtmlValidator {
    return new HtmlValidator()
  }

  public validate (field: string, input: string): Either<NotHtmlError, void> {
    const tester = /<([a-zA-Z]+)(\s*|>).*(>|\/\1>)/

    if (!tester.test(input)) {
      return left(NotHtmlError.create(field, input))
    }

    return right()
  }
}
