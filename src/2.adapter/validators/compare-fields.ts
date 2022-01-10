import InvalidParamError from '@/2.adapter/errors/invalid-param-error'
import Validator from '@/2.adapter/interfaces/validator'

export default class CompareFieldsValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
