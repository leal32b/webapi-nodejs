import { InvalidEmailError } from '@/core/0.domain/errors/invalid-email-error'

type SutTypes = {
  sut: typeof InvalidEmailError
}

const makeSut = (): SutTypes => {
  const sut = InvalidEmailError

  return { sut }
}

describe('InvalidEmailError', () => {
  describe('success', () => {
    it('returns an InvalidEmailError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_mail'

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(InvalidEmailError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_mail'

      const result = new sut(field, input)

      expect(result.props).toEqual({
        field: 'any_field',
        input: 'invalid_mail',
        message: 'should have format: "name@mail.com"'
      })
    })
  })
})
