import { Validator } from '@/common/0.domain/base/validator'
import { MinLengthError } from '@/common/0.domain/errors/min-length.error'
import { type Either, left, right } from '@/common/0.domain/utils/either'

type Props = {
  minLength: number
}

export class MinLengthValidator extends Validator<Props> {
  public static create (props: Props): MinLengthValidator {
    return new MinLengthValidator(props)
  }

  public validate (field: string, input: string): Either<MinLengthError, void> {
    const { minLength } = this.props

    if (!input || input.length < minLength) {
      return left(MinLengthError.create(field, minLength, input))
    }

    return right()
  }
}
