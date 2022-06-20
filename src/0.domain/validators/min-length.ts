import Validator from '@/0.domain/base/validator'
import MinLengthError from '@/0.domain/errors/min-length'
import { Either, left, right } from '@/0.domain/utils/either'

type Props = {
  minLength: number
}

export default class MinLengthValidator extends Validator {
  constructor (private readonly props: Props) {
    super()
  }

  validate (field: string, input: string): Either<MinLengthError, true> {
    const { minLength } = this.props

    if (!input || input.length < minLength) {
      return left(new MinLengthError(field, minLength, input))
    }

    return right(true)
  }
}
