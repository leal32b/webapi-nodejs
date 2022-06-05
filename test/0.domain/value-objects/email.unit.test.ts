import InvalidParamError from '@/0.domain/errors/invalid-param'
import Email from '@/0.domain/value-objects/email'

type SutTypes = {
  sut: typeof Email
}

const makeSut = (): SutTypes => {
  const sut = Email

  return { sut }
}

describe('Email', () => {
  describe('success', () => {
    it('returns a new Email when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any@mail.com'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Email)
    })
  })

  describe('failure', () => {
    it('returns at least one error if input is invalid', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(InvalidParamError)
    })

    it('returns an array with errors if validators fail more than once', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(Array.isArray(result.value)).toBeTruthy()
    })
  })
})
