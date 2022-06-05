import InvalidParamError from '@/0.domain/errors/invalid-param'
import MaxLengthValidator from '@/0.domain/validators/max-length'

type SutTypes = {
  sut: MaxLengthValidator
  maxLength: number
}

const makeSut = (): SutTypes => {
  const injection = { maxLength: 16 }
  const sut = new MaxLengthValidator(injection)

  return { sut, ...injection }
}

describe('MaxLengthValidator', () => {
  describe('success', () => {
    it('returns null when input.length is equal to maxLength', () => {
      const { sut } = makeSut()
      const input = 'exact_length____'

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })

    it('returns null when input.length is lower than maxLength', () => {
      const { sut } = makeSut()
      const input = 'short_string'

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })

    it('returns null when input is an empty string', () => {
      const { sut } = makeSut()
      const input = ''

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })

    it('returns null when input is null', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })
  })

  describe('failure', () => {
    it('returns InvalidParamError when input.length is greater than maxLength', () => {
      const { sut, maxLength } = makeSut()
      const input = 'exceeding_max_length_string'

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError(`maxLength: ${maxLength}`))
    })

    it('returns InvalidParamError when input is undefined', () => {
      const { sut } = makeSut()
      const input = undefined

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })
  })
})
