import { To } from '@/communication/0.domain/value-objects/to'
import { InvalidEmailError } from '@/core/0.domain/errors/invalid-email-error'
import { MaxLengthError } from '@/core/0.domain/errors/max-length-error'
import { MinLengthError } from '@/core/0.domain/errors/min-length-error'

type SutTypes = {
  sut: typeof To
}

const makeSut = (): SutTypes => {
  const sut = To

  return { sut }
}

describe('To', () => {
  describe('success', () => {
    it('returns a To when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any@mail.com'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(To)
    })
  })

  describe('failure', () => {
    it('returns MinLengthError when input.length is lower than minLength', () => {
      const { sut } = makeSut()
      const input = 'a@b.com'

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(MinLengthError)
    })

    it('returns MaxLengthError when input.length is higher than maxLength', () => {
      const { sut } = makeSut()
      const input = 'input_that_exceeds_to_max_length_of_sixty_four_characters@mail.com'

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(MaxLengthError)
    })

    it('returns InvalidEmailError when input is not an e-mail', () => {
      const { sut } = makeSut()
      const input = 'invalid_email'

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(InvalidEmailError)
    })
  })
})
