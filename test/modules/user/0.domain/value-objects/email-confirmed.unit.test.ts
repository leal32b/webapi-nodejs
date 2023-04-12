import { NullError } from '@/core/0.domain/errors/null-error'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'

type SutTypes = {
  sut: typeof EmailConfirmed
}

const makeSut = (): SutTypes => {
  const sut = EmailConfirmed

  return { sut }
}

describe('EmailConfirmed', () => {
  describe('success', () => {
    it('returns EmailConfirmed when input is valid', () => {
      const { sut } = makeSut()
      const input = true

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(EmailConfirmed)
    })
  })

  describe('failure', () => {
    it('returns NullError when input is null', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })
  })
})
