import ValueObject from '@/0.domain/base/value-object'
import Validator from '@/0.domain/interfaces/validator'
import MinLengthValidator from '@/0.domain/validators/min-length'

const makeMinLengthValidatorStub = (): Validator[] => [
  new MinLengthValidator({ minLength: 6 })
]

type SutTypes = {
  sut: typeof ValueObject
}

const makeSut = (): SutTypes => {
  const sut = ValueObject

  return { sut }
}

describe('ValueObject', () => {
  describe('success', () => {
    it('returns right if all validators pass', () => {
      const { sut } = makeSut()
      const value = 'any_value'

      const result = sut.validate(value, makeMinLengthValidatorStub())

      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('failure', () => {
    it('returns an array of errors if any validator fails', () => {
      const { sut } = makeSut()
      const value = 'short'

      const result = sut.validate(value, makeMinLengthValidatorStub())

      expect(result.value[0]).toBeInstanceOf(Error)
    })
  })
})
