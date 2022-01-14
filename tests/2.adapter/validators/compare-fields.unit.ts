import InvalidParamError from '@/2.adapter/errors/invalid-param'
import Validator from '@/2.adapter/interfaces/validator'
import CompareFieldsValidator from '@/2.adapter/validators/compare-fields'

type SutTypes = {
  sut: Validator
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidator('field', 'fieldToCompare')

  return { sut }
}

describe('CompareFieldsValidator', () => {
  describe('exception', () => {
    it('should return a InvalidParamError if validation fails', () => {
      const { sut } = makeSut()
      const error = sut.validate({
        field: 'any_value',
        fieldToCompare: 'other_value'
      })

      expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })
  })

  describe('success', () => {
    it('should not return if validation succeeds', () => {
      const { sut } = makeSut()
      const error = sut.validate({
        field: 'any_value',
        fieldToCompare: 'any_value'
      })

      expect(error).toBeFalsy()
    })
  })
})
