import InvalidParamError from '@/0.domain/errors/invalid-param'

type SutTypes = {
  sut: typeof InvalidParamError
}

const makeSut = (): SutTypes => {
  const sut = InvalidParamError

  return { sut }
}

describe('InvalidParamError', () => {
  describe('success', () => {
    it('returns a InvalidParamError', () => {
      const { sut } = makeSut()
      const message = 'any_message'

      const result = new sut(message)

      expect(result).toBeInstanceOf(InvalidParamError)
    })

    it('returns a InvalidParamError with correct name', () => {
      const { sut } = makeSut()
      const message = 'any_message'

      const result = new sut(message)

      expect(result.name).toBe('InvalidParamError')
    })

    it('returns a InvalidParamError with passed message', () => {
      const { sut } = makeSut()
      const message = 'any_message'

      const result = new sut(message)

      expect(result.message).toBe(message)
    })
  })
})
