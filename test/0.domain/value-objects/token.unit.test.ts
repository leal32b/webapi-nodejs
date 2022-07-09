import DomainError from '@/0.domain/base/domain-error'
import Token from '@/0.domain/value-objects/token'

type SutTypes = {
  sut: typeof Token
}

const makeSut = (): SutTypes => {
  const sut = Token

  return { sut }
}

describe('Token', () => {
  describe('success', () => {
    it('returns a new Token when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_Token'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Token)
    })
  })

  describe('failure', () => {
    it('returns at least one error when input is invalid', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an array with errors when validators fail more than once', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect((result.value as any).length).toBeGreaterThanOrEqual(1)
    })
  })
})
