import NullError from '@/0.domain/errors/null-error'

type SutTypes = {
  sut: typeof NullError
}

const makeSut = (): SutTypes => {
  const sut = NullError

  return { sut }
}

describe('NullError', () => {
  describe('success', () => {
    it('returns a NullError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(NullError)
    })

    it('returns the correct message when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = new sut(field, input)

      expect(result.props.message).toBe('should not be null')
    })

    it('returns the correct message when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = new sut(field, input)

      expect(result.props.message).toBe('should not be undefined')
    })
  })
})
