import { InvalidTokenError } from '@/common/2.presentation/errors/invalid-token.error'

type SutTypes = {
  sut: typeof InvalidTokenError
}

const makeSut = (): SutTypes => {
  const sut = InvalidTokenError

  return { sut }
}

describe('InvalidTokenError', () => {
  describe('success', () => {
    it('returns an InvalidTokenError with correct props', () => {
      const { sut } = makeSut()
      const type = 'Bearer'

      const result = sut.create(type)

      expect(result).toBeInstanceOf(InvalidTokenError)
      expect(result.props).toEqual({ message: 'token is invalid (type: Bearer)' })
    })
  })
})
