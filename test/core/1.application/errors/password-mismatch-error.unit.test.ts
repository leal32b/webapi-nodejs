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

      const result = sut.create(field)

      expect(result).toBeInstanceOf(PasswordMismatchError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const field = 'any_field'

      const result = sut.create(field)

      expect(result.props).toEqual({
        field: 'any_field',
        message: 'passwords should match'
      })
    })
  })
})
