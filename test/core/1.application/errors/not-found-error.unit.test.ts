import { NotFoundError } from '@/core/1.application/errors/not-found-error'

type SutTypes = {
  sut: typeof NotFoundError
}

const makeSut = (): SutTypes => {
  const sut = NotFoundError

  return { sut }
}

describe('NotFoundError', () => {
  describe('success', () => {
    it('returns a NotFoundError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any_input'

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(NotFoundError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any_input'

      const result = new sut(field, input)

      expect(result.props).toEqual({
        field: 'any_field',
        input: 'any_input',
        message: 'any_field "any_input" not found'
      })
    })
  })
})
