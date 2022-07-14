import InvalidPasswordError from '@/1.application/errors/invalid-password-error'

type SutTypes = {
  sut: typeof InvalidPasswordError
}

const makeSut = (): SutTypes => {
  const sut = InvalidPasswordError

  return { sut }
}

describe('InvalidPasswordError', () => {
  describe('success', () => {
    it('returns an InvalidPasswordError', () => {
      const { sut } = makeSut()
      const field = 'any_field'

      const result = new sut(field)

      expect(result).toBeInstanceOf(InvalidPasswordError)
    })

    it('returns an InvalidPasswordError with correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'

      const result = new sut(field)

      expect(result.props.message).toBe('passwords should match')
    })
  })
})
