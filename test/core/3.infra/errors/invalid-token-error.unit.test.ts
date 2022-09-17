import { InvalidTokenError } from '@/core/3.infra/errors/invalid-token-error'

type SutTypes = {
  sut: typeof InvalidTokenError
}

const makeSut = (): SutTypes => {
  const sut = InvalidTokenError

  return { sut }
}

describe('InvalidTokenError', () => {
  describe('success', () => {
    it('returns an InvalidTokenError', () => {
      const { sut } = makeSut()
      const type = 'Bearer'

      const result = new sut(type)

      expect(result).toBeInstanceOf(InvalidTokenError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const type = 'Bearer'

      const result = new sut(type)

      expect(result.props).toEqual({
        message: 'token is invalid (type: Bearer)'
      })
    })
  })
})
