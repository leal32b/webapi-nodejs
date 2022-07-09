import DomainError from '@/0.domain/base/domain-error'
import EmailConfirmed from '@/0.domain/value-objects/email-confirmed'

type SutTypes = {
  sut: typeof EmailConfirmed
}

const makeSut = (): SutTypes => {
  const sut = EmailConfirmed

  return { sut }
}

describe('EmailConfirmed', () => {
  describe('success', () => {
    it('returns a new EmailConfirmed', () => {
      const { sut } = makeSut()
      const input = true

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(EmailConfirmed)
    })
  })

  describe('failure', () => {
    it('returns at least one error when input is invalid', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an array with an error when validator fails', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect((result.value as any).length).toBeGreaterThanOrEqual(1)
    })
  })
})
