import InvalidParamError from '@/2.presentation/errors/invalid-param'
import ExtEmailValidator from '@/2.presentation/interfaces/ext-email-validator'
import Validator from '@/2.presentation/interfaces/validator'

export default class EmailValidator implements Validator {
  constructor (private readonly props: {
    extEmailValidator: ExtEmailValidator
    fieldName: string
  }) {}

  validate (input: any): Error {
    const isValid = this.props.extEmailValidator.isValid(input[this.props.fieldName])

    if (!isValid) {
      return new InvalidParamError(this.props.fieldName)
    }
  }
}
