import MinLengthError from '@/0.domain/errors/min-length-error'

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

    it('returns the correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const length = 6
      const input = 'any_input'

      const result = new sut(field, length, input)

      expect(result.props.message).toBe('should be at least 6 characters long')
    })
  })
})
