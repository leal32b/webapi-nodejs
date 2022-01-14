import InvalidParamError from '@/2.presentation/errors/invalid-param'
import Validator from '@/2.presentation/interfaces/validator'

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
