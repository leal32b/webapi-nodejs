import { EmailTakenError } from '@/core/1.application/errors/email-taken-error'

type SutTypes = {
  sut: typeof EmailTakenError
}

const makeSut = (): SutTypes => {
  const sut = EmailTakenError

  return { sut }
}

describe('EmailTakenError', () => {
  describe('success', () => {
    it('returns an EmailTakenError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail.com'

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(EmailTakenError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail.com'

      const result = new sut(field, input)

      expect(result.props).toEqual({
        field: 'any_field',
        input: 'any@mail.com',
        message: 'email already in use'
      })
    })
  })
})
