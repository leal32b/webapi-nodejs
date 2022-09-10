import { InvalidEmailError } from '@/core/0.domain/errors/invalid-email-error'
import { EmailValidator } from '@/core/0.domain/validators/email-validator'

type SutTypes = {
  sut: EmailValidator
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidator()

  return { sut }
}

describe('EmailValidator', () => {
  describe('success', () => {
    it('returns Right when input is a valid email', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail.com'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when input has no @', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'without_at.com'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when input has no domain', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when input is an empty string', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
    })

    it('returns InvalidEmailError when validation fails', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.value).toBeInstanceOf(InvalidEmailError)
    })
  })
})
