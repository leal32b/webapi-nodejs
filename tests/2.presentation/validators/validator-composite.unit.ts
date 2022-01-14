import MissingParamError from '@/2.presentation/errors/missing-param'
import Validator from '@/2.presentation/interfaces/validator'
import ValidatorComposite from '@/2.presentation/validators/validator-composite'
import { makeValidatorStub } from '~/2.presentation/stubs/validator.stub'

type SutTypes = {
  sut: Validator
  validators: Validator[]
}

const makeSut = (): SutTypes => {
  const validators = [
    makeValidatorStub(),
    makeValidatorStub()
  ]
  const sut = new ValidatorComposite(validators)

  return { sut, validators }
}

describe('ValidatorComposite', () => {
  describe('exceptions', () => {
    it('should return an error if any validator fails', () => {
      const { sut, validators } = makeSut()
      jest.spyOn(validators[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
      const error = sut.validate({ field: 'any_value' })

      expect(error).toEqual(new MissingParamError('field'))
    })

    it('should return first error if more than one validator fails', () => {
      const { sut, validators } = makeSut()
      jest.spyOn(validators[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
      jest.spyOn(validators[1], 'validate').mockReturnValueOnce(new Error())
      const error = sut.validate({ field: 'any_value' })

      expect(error).toEqual(new MissingParamError('field'))
    })
  })

  describe('success', () => {
    it('should not return an error if validator succeeds', () => {
      const { sut } = makeSut()
      const error = sut.validate({ field: 'any_value' })

      expect(error).toBeFalsy()
    })
  })
})
