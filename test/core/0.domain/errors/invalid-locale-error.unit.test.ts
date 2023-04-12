import { InvalidLocaleError } from '@/core/0.domain/errors/invalid-locale-error'

type SutTypes = {
  sut: typeof InvalidLocaleError
}

const makeSut = (): SutTypes => {
  const sut = InvalidLocaleError

  return { sut }
}

describe('InvalidLocaleError', () => {
  describe('success', () => {
    it('returns an InvalidLocaleError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'enUSA'

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(InvalidLocaleError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: 'enUSA',
        message: "should have format: 'en_US'"
      })
    })
  })
})
