import { InvalidLocaleError } from '@/core/0.domain/errors/invalid-locale-error'
import { LocaleValidator } from '@/core/0.domain/validators/locale-validator'

type SutTypes = {
  sut: LocaleValidator
}

const makeSut = (): SutTypes => {
  const sut = LocaleValidator.create()

  return { sut }
}

describe('LocaleValidator', () => {
  describe('success', () => {
    it('returns Right when input is a valid 2 characters locale', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'en'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right when input is a valid 5 characters locale', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'en_US'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with InvalidLocaleError when input does not have 2 or 5 characters', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'eng'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(InvalidLocaleError)
    })

    it('returns Left with InvalidLocaleError when input does not have an underscore', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'en-US'
      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(InvalidLocaleError)
    })

    it('returns Left with InvalidLocaleError when input has upper language code', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'EN_US'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(InvalidLocaleError)
    })

    it('returns Left with InvalidLocaleError when input has lower country code', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'en_us'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(InvalidLocaleError)
    })

    it('returns Left with InvalidLocaleError when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(InvalidLocaleError)
    })

    it('returns Left with InvalidLocaleError when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(InvalidLocaleError)
    })
  })
})
