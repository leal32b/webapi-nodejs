import DomainError from '@/0.domain/base/domain-error'
import Password from '@/0.domain/value-objects/password'

type SutTypes = {
  sut: typeof Password
}

const makeSut = (): SutTypes => {
  const sut = Password

  return { sut }
}

describe('Password', () => {
  describe('success', () => {
    it('returns a new Password when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_password'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Password)
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
