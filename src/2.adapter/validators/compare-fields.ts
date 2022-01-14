import InvalidParamError from '@/2.adapter/errors/invalid-param'
import Validator from '@/2.adapter/interfaces/validator'

export default class CompareFieldsValidator implements Validator {
  constructor (
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  validate (input: any): Error {
    if (input[this.field] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
