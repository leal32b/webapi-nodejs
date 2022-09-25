import { Validator } from '@/core/0.domain/base/validator'
import { NotHtmlError } from '@/core/0.domain/errors/not-html-error'
import { Either, left, right } from '@/core/0.domain/utils/either'

export class NotHtmlValidator extends Validator<null> {
  validate (field: string, input: string): Either<NotHtmlError, void> {
    const tester = /<([a-zA-Z]+)(\s*|>).*(>|\/\1>)/

    if (!tester.test(input)) {
      return left(new NotHtmlError(field, input))
    }

    return right()
  }
}
