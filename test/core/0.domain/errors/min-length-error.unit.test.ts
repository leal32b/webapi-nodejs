import { MinLengthError } from '@/core/0.domain/errors/min-length-error'

type SutTypes = {
  sut: typeof MinLengthError
}

const makeSut = (): SutTypes => {
  const sut = MinLengthError

  return { sut }
}

describe('MinLengthError', () => {
  describe('success', () => {
    it('returns a MinLengthError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const length = 6
      const input = 'short'

      const result = new sut(field, length, input)

      expect(result).toBeInstanceOf(MinLengthError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const length = 6
      const input = 'short'

      const result = new sut(field, length, input)

      expect(result.props).toEqual({
        field: 'any_field',
        input: 'short',
        message: 'should be at least 6 characters long'
      })
    })
  })
})
