import { DomainError } from '@/common/0.domain/base/domain-error'
import { InvalidEmailError } from '@/common/0.domain/errors/invalid-email.error'
import { MaxLengthError } from '@/common/0.domain/errors/max-length.error'
import { MinLengthError } from '@/common/0.domain/errors/min-length.error'

import { EmailTo } from '@/communication/0.domain/value-objects/email.to.value-object'

type SutTypes = {
  sut: typeof EmailTo
}

const makeSut = (): SutTypes => {
  const sut = EmailTo

  return { sut }
}

describe('EmailTo', () => {
  describe('success', () => {
    it('returns EmailTo when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any@mail.com'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(EmailTo)
    })

    it('returns EmailTo when input is a valid array', () => {
      const { sut } = makeSut()
      const input = ['any@mail.com', 'another@mail.com']

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(EmailTo)
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

    it('returns an error for each invalid array item', () => {
      const { sut } = makeSut()
      const input = ['invalid_email', 'another_invalid_email']

      const result = sut.create(input)

      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })
  })
})
