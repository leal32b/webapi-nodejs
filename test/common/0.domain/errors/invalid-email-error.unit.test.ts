import { InvalidEmailError } from '@/common/0.domain/errors/invalid-email-error'

type SutTypes = {
  sut: typeof InvalidEmailError
}

const makeSut = (): SutTypes => {
  const sut = InvalidEmailError

  return { sut }
}

describe('InvalidEmailError', () => {
  describe('success', () => {
    it('returns an InvalidEmailError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'invalid_mail'

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(InvalidEmailError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: 'invalid_mail',
        message: "should have format: 'name@mail.com'"
      })
    })
  })
})
