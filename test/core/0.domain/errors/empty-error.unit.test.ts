import { EmptyError } from '@/core/0.domain/errors/empty-error'

type SutTypes = {
  sut: typeof EmptyError
}

const makeSut = (): SutTypes => {
  const sut = EmptyError

  return { sut }
}

describe('EmptyError', () => {
  describe('success', () => {
    it('returns an EmptyError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = new sut(field, input)

      expect(result).toBeInstanceOf(EmptyError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = new sut(field, input)

      expect(result.props).toEqual({
        message: 'should not be empty',
        field: 'any_field',
        input: ''
      })
    })
  })
})
