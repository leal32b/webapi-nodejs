import { MinLengthError } from '@/common/0.domain/errors/min-length.error'

import { EmailText } from '@/communication/0.domain/value-objects/email.text.value-object'

type SutTypes = {
  sut: typeof EmailText
}

const makeSut = (): SutTypes => {
  const sut = EmailText

  return { sut }
}

describe('EmailText', () => {
  describe('success', () => {
    it('returns EmailText when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_text'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(EmailText)
    })
  })

  describe('failure', () => {
    it('returns MinLengthError when input.length is lower than minLength', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(MinLengthError)
    })
  })
})
