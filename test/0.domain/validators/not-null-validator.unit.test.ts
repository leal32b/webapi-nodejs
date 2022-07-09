import NullError from '@/0.domain/errors/null-error'
import NotNullValidator from '@/0.domain/validators/not-null-validator'

type SutTypes = {
  sut: NotNullValidator
}

const makeSut = (): SutTypes => {
  const sut = new NotNullValidator()

  return { sut }
}

describe('NotNullValidator', () => {
  describe('success', () => {
    it('returns Right when input is not null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('failure', () => {
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

    it('returns NotNullValidator when validation fails', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.value).toBeInstanceOf(NullError)
    })
  })
})
