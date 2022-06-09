import InvalidParamError from '@/0.domain/errors/invalid-param'
import EmailValidator from '@/0.domain/validators/email'

type SutTypes = {
  sut: EmailValidator
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidator()

  return { sut }
}

describe('EmailValidator', () => {
  describe('success', () => {
    it('returns null when input is a valid email', () => {
      const { sut } = makeSut()
      const input = 'any@mail.com'

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })
  })

  describe('failure', () => {
    it('returns InvalidParamError when input has no @', () => {
      const { sut } = makeSut()
      const input = 'without_at.com'

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('invalid email format'))
    })

    it('returns InvalidParamError when input has no domain', () => {
      const { sut } = makeSut()
      const input = 'any@mail'

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('invalid email format'))
    })

    it('returns InvalidParamError when input is an empty string', () => {
      const { sut } = makeSut()
      const input = ''

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('invalid email format'))
    })

    it('returns InvalidParamError when input is null', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('invalid email format'))
    })

    it('returns InvalidParamError when input is undefined', () => {
      const { sut } = makeSut()
      const input = undefined

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('invalid email format'))
    })
  })
})
