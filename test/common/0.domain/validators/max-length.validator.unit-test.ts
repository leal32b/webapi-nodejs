import { MaxLengthError } from '@/common/0.domain/errors/max-length.error'
import { MaxLengthValidator } from '@/common/0.domain/validators/max-length.validator'

type SutTypes = {
  maxLength: number
  sut: MaxLengthValidator
}

const makeSut = (): SutTypes => {
  const props = {
    maxLength: 16
  }
  const sut = MaxLengthValidator.create(props)

  return {
    ...props,
    sut
  }
}

describe('MaxLengthValidator', () => {
  describe('success', () => {
    it('returns Right when input.length is equal to maxLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'exact_length____'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input.length is lower than maxLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'short_string'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input is an empty string', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with MaxLengthError when input.length is greater than maxLength', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'exceeding_max_length_string'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(MaxLengthError)
    })
  })
})
