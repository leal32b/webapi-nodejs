import { Validator } from '@/core/0.domain/base/validator'
import { MaxLengthError } from '@/core/0.domain/errors/max-length-error'
import { Either, left, right } from '@/core/0.domain/utils/either'

type Props = {
  maxLength: number
}

export class MaxLengthValidator extends Validator<Props> {
  validate (field: string, input: string): Either<MaxLengthError, void> {
    const { maxLength } = this.props

    if (input?.length > maxLength) {
      return left(new MaxLengthError(field, maxLength, input))
    }

    return right(null)
  }
}
