import DomainError from '@/0.domain/base/domain-error'
import Email from '@/0.domain/value-objects/email'

type SutTypes = {
  sut: typeof Email
}

const makeSut = (): SutTypes => {
  const sut = Email

  return { sut }
}

describe('Email', () => {
  describe('success', () => {
    it('returns a new Email when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any@mail.com'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Email)
    })
  })

  describe('failure', () => {
    it('returns at least one error when input is invalid', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an array with errors when validators fail more than once', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect((result.value as any).length).toBeGreaterThanOrEqual(1)
    })
  })
})
