import { EmailTakenError } from '@/1.application/errors/email-taken-error'

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

    it('returns an EmailTakenError with correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail.com'

      const result = new sut(field, input)

      expect(result.props.message).toBe('email already in use')
    })
  })
})
