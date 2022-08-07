import { InvalidPasswordError } from '@/core/1.application/errors/invalid-password-error'

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

      const result = new sut()

      expect(result).toBeInstanceOf(InvalidPasswordError)
    })

    it('returns a InvalidPasswordError with correct message', () => {
      const { sut } = makeSut()

      const result = new sut()

      expect(result.props.message).toBe('invalid username or password')
    })
  })
})
