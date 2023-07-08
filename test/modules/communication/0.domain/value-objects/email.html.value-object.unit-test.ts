import { NotHtmlError } from '@/common/0.domain/errors/not-html.error'

import { EmailHtml } from '@/communication/0.domain/value-objects/email.html.value-object'

type SutTypes = {
  sut: typeof EmailHtml
}

const makeSut = (): SutTypes => {
  const sut = EmailHtml

  return { sut }
}

describe('EmailHtml', () => {
  describe('success', () => {
    it('returns EmailHtml when input is valid', () => {
      const { sut } = makeSut()
      const input = '<html>any_text</html>'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(EmailHtml)
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
