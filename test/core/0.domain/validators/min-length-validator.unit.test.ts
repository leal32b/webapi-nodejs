import { MinLengthError } from '@/core/0.domain/errors/min-length-error'
import { MinLengthValidator } from '@/core/0.domain/validators/min-length-validator'

type SutTypes = {
  sut: MinLengthValidator
  minLength: number
}

const makeSut = (): SutTypes => {
  const injection = {
    minLength: 7
  }
  const sut = new MinLengthValidator(injection)

  return { sut, ...injection }
}

describe('MinLengthValidator', () => {
  describe('success', () => {
    it('returns Right when input.length is equal to minLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'minimum'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBeTruthy()
    })

    it('returns Right when input.length is greater than minLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'long_string'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('failure', () => {
    it('returns Left when input.length is lower than minLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'short'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns Left when input is an empty string', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns Left when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns Left when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns MinLengthError when validation fails', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.value).toBeInstanceOf(MinLengthError)
    })
  })
})
