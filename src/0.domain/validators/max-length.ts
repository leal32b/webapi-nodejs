import InvalidParamError from '@/0.domain/errors/invalid-param'
import Validator from '@/0.domain/interfaces/validator'
import { Either, left, right } from '@/0.domain/utils/either'

type Props = {
  maxLength: number
}

export default class MaxLengthValidator implements Validator {
  constructor (private readonly props: Props) {}

  validate (input: string): Either<InvalidParamError, null> {
    const { maxLength } = this.props

    if (input?.length > maxLength) {
      return left(new InvalidParamError(`maxLength: ${maxLength}`))
    }

    return right(null)
  }
}
