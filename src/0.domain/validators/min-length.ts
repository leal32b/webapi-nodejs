import InvalidParamError from '@/0.domain/errors/invalid-param'
import Validator from '@/0.domain/interfaces/validator'
import { Either, left, right } from '@/0.domain/utils/either'

type Props = {
  minLength: number
}

export default class MinLengthValidator implements Validator {
  constructor (private readonly props: Props) {}

  validate (input: string): Either<InvalidParamError, null> {
    const { minLength } = this.props

    if (!input || input.length < minLength) {
      return left(new InvalidParamError(`minLength: ${minLength}`))
    }

    return right(null)
  }
}
