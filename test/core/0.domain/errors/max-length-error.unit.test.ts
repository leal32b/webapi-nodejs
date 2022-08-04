import { MaxLengthError } from '@/core/0.domain/errors/max-length-error'

type SutTypes = {
  sut: typeof MaxLengthError
}

const makeSut = (): SutTypes => {
  const sut = MaxLengthError

  return { sut }
}

describe('MaxLengthError', () => {
  describe('success', () => {
    it('returns a MaxLengthError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const length = 6
      const input = 'long_string'

      const result = new sut(field, length, input)

      expect(result).toBeInstanceOf(MaxLengthError)
    })

    it('returns the correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const length = 6
      const input = 'long_string'

      const result = new sut(field, length, input)

      expect(result.props.message).toBe('should have a maximum of 6 characters')
    })
  })
})
