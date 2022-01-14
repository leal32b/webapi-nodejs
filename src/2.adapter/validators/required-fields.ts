import MissingParamError from '@/2.adapter/errors/missing-param'
import Validator from '@/2.adapter/interfaces/validator'

export default class RequiredFieldValidator implements Validator {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
