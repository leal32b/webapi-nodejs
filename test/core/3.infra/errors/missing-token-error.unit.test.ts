import { MissingTokenError } from '@/core/3.infra/errors/missing-token-error'

type SutTypes = {
  sut: typeof MissingTokenError
}

const makeSut = (): SutTypes => {
  const sut = MissingTokenError

  return { sut }
}

describe('MissingTokenError', () => {
  describe('success', () => {
    it('returns a MissingTokenError', () => {
      const { sut } = makeSut()

      const result = sut.create()

      expect(result).toBeInstanceOf(MissingTokenError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()

      const result = sut.create()

      expect(result.props).toEqual({
        message: 'no Authorization token was provided'
      })
    })
  })
})
