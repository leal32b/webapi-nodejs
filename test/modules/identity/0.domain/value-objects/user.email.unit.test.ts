import { InvalidEmailError } from '@/common/0.domain/errors/invalid-email-error'
import { MaxLengthError } from '@/common/0.domain/errors/max-length-error'
import { MinLengthError } from '@/common/0.domain/errors/min-length-error'

import { UserEmail } from '@/identity/0.domain/value-objects/user.email'

type SutTypes = {
  sut: typeof UserEmail
}

const makeSut = (): SutTypes => {
  const sut = UserEmail

  return { sut }
}

describe('UserEmail', () => {
  describe('success', () => {
    it('returns UserEmail when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any@mail.com'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(UserEmail)
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
      const input = 'input_that_exceeds_email_max_length_of_sixty_four_characters@mail.com'

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
