import { Validator } from '@/common/0.domain/base/validator'
import { MaxLengthError } from '@/common/0.domain/errors/max-length.error'
import { type Either, left, right } from '@/common/0.domain/utils/either'

type Props = {
  maxLength: number
}

export class MaxLengthValidator extends Validator<Props> {
  public static create (props: Props): MaxLengthValidator {
    return new MaxLengthValidator(props)
  }

  public validate (field: string, input: string): Either<MaxLengthError, void> {
    const { maxLength } = this.props

    if (input?.length > maxLength) {
      return left(MaxLengthError.create(field, maxLength, input))
    }

    return right()
  }
}
