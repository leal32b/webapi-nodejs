import ValueObject from '@/0.domain/base/value-object'
import MinLengthValidator from '@/0.domain/validators/min-length'

const minLengthValidator = [
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

      const result = sut.validate(value, minLengthValidator)

      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('failure', () => {
    it('returns an array of errors if any validator fails', () => {
      const { sut } = makeSut()
      const value = 'short'

      const result = sut.validate(value, minLengthValidator)

      expect(result.value[0]).toBeInstanceOf(Error)
    })
  })
})
