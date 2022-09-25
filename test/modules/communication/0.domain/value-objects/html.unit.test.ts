import { Html } from '@/communication/0.domain/value-objects/html'
import { NotHtmlError } from '@/core/0.domain/errors/not-html-error'

type SutTypes = {
  sut: typeof Html
}

const makeSut = (): SutTypes => {
  const sut = Html

  return { sut }
}

describe('Html', () => {
  describe('success', () => {
    it('returns a Html when input is valid', () => {
      const { sut } = makeSut()
      const input = '<html>any_text</html>'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Html)
    })
  })

  describe('failure', () => {
    it('returns NotHtmlError when input is an invalid html text', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(NotHtmlError)
    })
  })
})
