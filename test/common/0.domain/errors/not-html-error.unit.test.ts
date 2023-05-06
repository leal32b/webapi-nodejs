import { NotHtmlError } from '@/common/0.domain/errors/not-html-error'

type SutTypes = {
  sut: typeof NotHtmlError
}

const makeSut = (): SutTypes => {
  const sut = NotHtmlError

  return { sut }
}

describe('NotHtmlError', () => {
  describe('success', () => {
    it('returns a NotHtmlError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_html'

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(NotHtmlError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: 'invalid_html',
        message: 'should be a valid html'
      })
    })
  })
})
