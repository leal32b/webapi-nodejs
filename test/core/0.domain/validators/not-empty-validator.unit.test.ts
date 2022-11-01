import { EmptyError } from '@/core/0.domain/errors/empty-error'
import { NotEmptyValidator } from '@/core/0.domain/validators/not-empty-validator'

type SutTypes = {
  sut: NotEmptyValidator
}

const makeSut = (): SutTypes => {
  const sut = NotEmptyValidator.create()

  return { sut }
}

describe('NotEmptyValidator', () => {
  describe('success', () => {
    it('returns Right when input is not empty', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when input is an empty string', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
    })

    it('returns EmptyError when validation fails', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.value).toBeInstanceOf(EmptyError)
    })
  })
})
