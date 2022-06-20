import InvalidEmailError from '@/0.domain/errors/invalid-email'

type SutTypes = {
  sut: typeof InvalidEmailError
}

const makeSut = (): SutTypes => {
  const sut = InvalidEmailError

  return { sut }
}

describe('InvalidEmailError', () => {
  describe('success', () => {
    it('returns an InvalidEmailError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail'

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(InvalidEmailError)
    })

    it('returns a InvalidEmailError with correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail'

      const result = new sut(field, input)

      expect(result.props.message).toBe('should have format: name@mail.com')
    })
  })
})
