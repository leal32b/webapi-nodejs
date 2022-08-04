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
    it('returns an InvalidDateError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_format'

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(InvalidDateError)
    })

    it('returns the correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_format'

      const result = new sut(field, input)

      expect(result.props.message).toBe('should have format: "yyyy-MM-ddTHH:mm:ss.fffZ"')
    })
  })
})
