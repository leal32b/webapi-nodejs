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
    it('returns an InvalidPasswordError with correct props', () => {
      const { sut } = makeSut()

      const result = sut.create()

      expect(result).toBeInstanceOf(InvalidPasswordError)
      expect(result.props).toEqual({ message: 'invalid username or password' })
    })
  })
})
