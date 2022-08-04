import { InvalidDateError } from '@/core/0.domain/errors/invalid-date-error'
import { DateValidator } from '@/core/0.domain/validators/date-validator'

type SutTypes = {
  sut: DateValidator
}

const makeSut = (): SutTypes => {
  const sut = new DateValidator()

  return { sut }
}

describe('DateValidator', () => {
  describe('success', () => {
    it('returns Right when input is a valid date', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = '2022-07-02T22:37:52.000Z'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBeTruthy()
    })
  })

  describe('failure', () => {
    it('returns Left when input is an invalid date', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_date'

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns Left when input is an empty string', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBeTruthy()
    })

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

    it('returns InvalidDateError when validation fails', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.validate(field, input)

      expect(result.value).toBeInstanceOf(InvalidDateError)
    })
  })
})
