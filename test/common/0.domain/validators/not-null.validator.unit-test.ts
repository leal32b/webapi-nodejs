import { NullError } from '@/common/0.domain/errors/null.error'
import { NotNullValidator } from '@/common/0.domain/validators/not-null.validator'

type SutTypes = {
  sut: NotNullValidator
}

const makeSut = (): SutTypes => {
  const sut = NotNullValidator.create()

  return { sut }
}

describe('NotNullValidator', () => {
  describe('success', () => {
    it('returns Right when input is not null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with NotNullValidator when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NullError)
    })

    it('returns Left with NotNullValidator when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NullError)
    })
  })
})
