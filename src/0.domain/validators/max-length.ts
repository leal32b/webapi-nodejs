import Validator from '@/0.domain/base/validator'
import MaxLengthError from '@/0.domain/errors/max-length'
import { Either, left, right } from '@/0.domain/utils/either'

type Props = {
  maxLength: number
}

export default class MaxLengthValidator extends Validator {
  constructor (private readonly props: Props) {
    super()
  }

  validate (field: string, input: string): Either<MaxLengthError, true> {
    const { maxLength } = this.props

    if (input?.length > maxLength) {
      return left(new MaxLengthError(field, maxLength, input))
    }

    return right(true)
  }
}
