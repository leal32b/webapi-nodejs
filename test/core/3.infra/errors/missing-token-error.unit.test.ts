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

      const result = new sut()

      expect(result).toBeInstanceOf(MissingTokenError)
    })

    it('returns a MissingTokenError with correct message', () => {
      const { sut } = makeSut()

      const result = new sut()

      expect(result.props.message).toBe('no Authorization token was provided')
    })
  })
})
