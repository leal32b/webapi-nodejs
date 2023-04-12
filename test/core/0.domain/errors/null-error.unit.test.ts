import { NullError } from '@/core/0.domain/errors/null-error'

type SutTypes = {
  sut: typeof NullError
}

const makeSut = (): SutTypes => {
  const sut = NullError

  return { sut }
}

describe('NullError', () => {
  describe('success', () => {
    it('returns a NullError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(NullError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: null,
        message: 'should not be null'
      })
    })
  })
})
