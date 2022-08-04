import { Validator } from '@/0.domain/base/validator'
import { MinLengthError } from '@/0.domain/errors/min-length-error'
import { Either, left, right } from '@/0.domain/utils/either'

type Props = {
  minLength: number
}

export class MinLengthValidator extends Validator<Props> {
  validate (field: string, input: string): Either<MinLengthError, void> {
    const { minLength } = this.props

    if (!input || input.length < minLength) {
      return left(new MinLengthError(field, minLength, input))
    }

    return right(null)
  }
}
