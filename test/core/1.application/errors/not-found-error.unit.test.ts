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

    it('returns an NotFoundError with correct message', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any_input'

      const result = new sut(field, input)

      expect(result.props.message).toBe('any_field "any_input" not found')
    })
  })
})
