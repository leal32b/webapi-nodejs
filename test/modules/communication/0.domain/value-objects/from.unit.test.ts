import { InvalidEmailError } from '@/common/0.domain/errors/invalid-email-error'
import { MaxLengthError } from '@/common/0.domain/errors/max-length-error'
import { MinLengthError } from '@/common/0.domain/errors/min-length-error'

import { From } from '@/communication/0.domain/value-objects/from'

type SutTypes = {
  sut: typeof From
}

const makeSut = (): SutTypes => {
  const sut = From

  return { sut }
}

describe('From', () => {
  describe('success', () => {
    it('returns From when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any@mail.com'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(From)
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
      const input = 'input_that_exceeds_from_max_length_of_sixty_four_characters@mail.com'

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
