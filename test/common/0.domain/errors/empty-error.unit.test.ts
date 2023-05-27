import { EmptyError } from '@/common/0.domain/errors/empty-error'

type SutTypes = {
  sut: typeof EmptyError
}

const makeSut = (): SutTypes => {
  const sut = EmptyError

  return { sut }
}

describe('EmptyError', () => {
  describe('success', () => {
    it('returns an EmptyError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = ''

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(EmptyError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: '',
        message: 'should not be empty'
      })
    })
  })
})
