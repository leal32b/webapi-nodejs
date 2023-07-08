import { MissingTokenError } from '@/common/2.presentation/errors/missing-token.error'

type SutTypes = {
  sut: typeof MissingTokenError
}

const makeSut = (): SutTypes => {
  const sut = MissingTokenError

  return { sut }
}

describe('MissingTokenError', () => {
  describe('success', () => {
    it('returns a MissingTokenError with correct props', () => {
      const { sut } = makeSut()

      const result = sut.create()

      expect(result).toBeInstanceOf(MissingTokenError)
      expect(result.props).toEqual({ message: 'no Authorization token was provided' })
    })
  })
})
