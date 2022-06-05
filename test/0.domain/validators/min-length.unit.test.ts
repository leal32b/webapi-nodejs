import InvalidParamError from '@/0.domain/errors/invalid-param'
import MinLengthValidator from '@/0.domain/validators/min-length'

type SutTypes = {
  sut: MinLengthValidator
  minLength: number
}

const makeSut = (): SutTypes => {
  const injection = { minLength: 7 }
  const sut = new MinLengthValidator(injection)

  return { sut, ...injection }
}

describe('MinLengthValidator', () => {
  describe('success', () => {
    it('returns null when input.length is equal to MinLengthValidator.length', () => {
      const { sut } = makeSut()
      const input = 'minimum'

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })

    it('returns null when input.length is greater than MinLengthValidator.length', () => {
      const { sut } = makeSut()
      const input = 'long_string'

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })
  })

  describe('failure', () => {
    it('returns InvalidParamError when input.length is lower than MinLengthValidator.length', () => {
      const { sut, minLength } = makeSut()
      const input = 'short'

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError(`minLength: ${minLength}`))
    })

    it('returns InvalidParamError when input is an empty string', () => {
      const { sut, minLength } = makeSut()
      const input = ''

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError(`minLength: ${minLength}`))
    })

    it('returns InvalidParamError when input is null', () => {
      const { sut, minLength } = makeSut()
      const input = null

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError(`minLength: ${minLength}`))
    })

    it('returns InvalidParamError when input is undefined', () => {
      const { sut, minLength } = makeSut()
      const input = undefined

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError(`minLength: ${minLength}`))
    })
  })
})
