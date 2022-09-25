import { Text } from '@/communication/0.domain/value-objects/text'
import { MinLengthError } from '@/core/0.domain/errors/min-length-error'

type SutTypes = {
  sut: typeof Text
}

const makeSut = (): SutTypes => {
  const sut = Text

  return { sut }
}

describe('Text', () => {
  describe('success', () => {
    it('returns a Text when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_text'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Text)
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
