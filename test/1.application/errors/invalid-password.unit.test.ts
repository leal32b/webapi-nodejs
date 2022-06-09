import InvalidPasswordError from '@/1.application/errors/invalid-password'

type SutTypes = {
  sut: typeof InvalidPasswordError
}

const makeSut = (): SutTypes => {
  const sut = InvalidPasswordError

  return { sut }
}

describe('InvalidPasswordError', () => {
  describe('success', () => {
    it('returns a InvalidPasswordError', () => {
      const { sut } = makeSut()
      const message = 'any_message'

      const result = new sut(message)

      expect(result).toBeInstanceOf(InvalidPasswordError)
    })

    it('returns a InvalidPasswordError with correct name', () => {
      const { sut } = makeSut()
      const message = 'any_message'

      const result = new sut(message)

      expect(result.name).toBe('InvalidPasswordError')
    })

    it('returns a InvalidPasswordError with passed message', () => {
      const { sut } = makeSut()
      const message = 'any_message'

      const result = new sut(message)

      expect(result.message).toBe(message)
    })
  })
})
