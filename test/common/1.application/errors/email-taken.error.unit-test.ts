import { EmailTakenError } from '@/common/1.application/errors/email-taken.error'

type SutTypes = {
  sut: typeof EmailTakenError
}

const makeSut = (): SutTypes => {
  const sut = EmailTakenError

  return { sut }
}

describe('EmailTakenError', () => {
  describe('success', () => {
    it('returns an EmailTakenError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any@mail.com'

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(EmailTakenError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: 'any@mail.com',
        message: 'email already in use'
      })
    })
  })
})
