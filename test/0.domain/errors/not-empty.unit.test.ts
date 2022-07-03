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
    it('returns a NotEmptyError when input is empty', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(NotEmptyError)
    })

    it('returns the correct message when input is empty', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = new sut(field, input)

      expect(result.props.message).toBe('should not be empty')
    })

    it('returns a NotEmptyError when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(NotEmptyError)
    })

    it('returns the correct message when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = new sut(field, input)

      expect(result.props.message).toBe('should not be null')
    })

    it('returns a NotEmptyError when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(NotEmptyError)
    })

    it('returns the correct message when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = new sut(field, input)

      expect(result.props.message).toBe('should not be undefined')
    })
  })
})
