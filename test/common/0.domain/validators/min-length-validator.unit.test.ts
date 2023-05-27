import { MinLengthError } from '@/common/0.domain/errors/min-length-error'
import { MinLengthValidator } from '@/common/0.domain/validators/min-length-validator'

type SutTypes = {
  sut: MinLengthValidator
  minLength: number
}

const makeSut = (): SutTypes => {
  const props = {
    minLength: 7
  }
  const sut = MinLengthValidator.create(props)

  return { sut, ...props }
}

describe('MinLengthValidator', () => {
  describe('success', () => {
    it('returns Right when input.length is equal to minLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'minimum'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input.length is greater than minLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'long_string'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with MinLengthError when input.length is lower than minLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'short'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(MinLengthError)
    })

    it('returns Left with MinLengthError when input is an empty string', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(MinLengthError)
    })

    it('returns Left with MinLengthError when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(MinLengthError)
    })

    it('returns Left with MinLengthError when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(MinLengthError)
    })
  })
})
