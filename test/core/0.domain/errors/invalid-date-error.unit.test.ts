import { InvalidDateError } from '@/core/0.domain/errors/invalid-date-error'

type SutTypes = {
  sut: typeof InvalidDateError
}

const makeSut = (): SutTypes => {
  const sut = InvalidDateError

  return { sut }
}

describe('InvalidDateError', () => {
  describe('success', () => {
    it('returns an InvalidDateError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_date'

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(InvalidDateError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: 'invalid_date',
        message: "should have format: 'yyyy-MM-ddTHH:mm:ss.fffZ'"
      })
    })
  })
})
