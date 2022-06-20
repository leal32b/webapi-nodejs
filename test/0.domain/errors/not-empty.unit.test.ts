import NotEmptyError from '@/0.domain/errors/not-empty'

type SutTypes = {
  sut: typeof NotEmptyError
}

const makeSut = (): SutTypes => {
  const sut = NotEmptyError

  return { sut }
}

describe('NotEmptyError', () => {
  describe('success', () => {
    it('returns an NotEmptyError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(NotEmptyError)
    })

    it('returns an NotEmptyError with correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = new sut(field, input)

      expect(result.props.message).toBe('should not be empty')
    })
  })
})
