import MissingParamError from '@/2.presentation/errors/missing-param'
import Validator from '@/2.presentation/interfaces/validator'
import RequiredFieldValidator from '@/2.presentation/validators/required-fields'

type SutTypes = {
  sut: Validator
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidator('field')

  return { sut }
}

describe('RequiredFieldsValidator', () => {
  describe('exception', () => {
    it('should return a MissingParamError if validation fails', () => {
      const { sut } = makeSut()
      const error = sut.validate({ other_field: 'any_value' })

      expect(error).toEqual(new MissingParamError('field'))
    })
  })

  describe('success', () => {
    it('should not return if validation succeeds', () => {
      const { sut } = makeSut()
      const error = sut.validate({ field: 'any_value' })

      expect(error).toBeFalsy()
    })
  })
})
