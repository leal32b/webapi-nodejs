import { PasswordMismatchError } from '@/core/1.application/errors/password-mismatch-error'

type SutTypes = {
  sut: typeof PasswordMismatchError
}

const makeSut = (): SutTypes => {
  const sut = PasswordMismatchError

  return { sut }
}

describe('PasswordMismatchError', () => {
  describe('success', () => {
    it('returns a PasswordMismatchError', () => {
      const { sut } = makeSut()
      const field = 'any_field'

      const result = new sut(field)

      expect(result).toBeInstanceOf(PasswordMismatchError)
    })

    it('returns a PasswordMismatchError with correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'

      const result = new sut(field)

      expect(result.props.message).toBe('passwords should match')
    })
  })
})
