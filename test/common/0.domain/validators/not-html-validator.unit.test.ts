import { NotHtmlError } from '@/common/0.domain/errors/not-html-error'
import { NotHtmlValidator } from '@/common/0.domain/validators/not-html-validator'

type SutTypes = {
  sut: NotHtmlValidator
}

const makeSut = (): SutTypes => {
  const sut = NotHtmlValidator.create()

  return { sut }
}

describe('NotHtmlValidator', () => {
  describe('success', () => {
    it('returns Right when input is a valid html', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = '<html>any_text</html>'

      const result = sut.validate(field, input)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left with NotHtmlError when input is an invalid html', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.validate(field, input)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NotHtmlError)
    })
  })
})
