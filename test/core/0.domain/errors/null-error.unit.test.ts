import { NullError } from '@/core/0.domain/errors/null-error'

type SutTypes = {
  sut: typeof NullError
}

const makeSut = (): SutTypes => {
  const sut = NullError

  return { sut }
}

describe('NullError', () => {
  describe('success', () => {
    it('returns a NullError', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(NullError)
    })

    it('returns props with correct values when input is null', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = null

      const result = sut.create(field, input)

      expect(result.props).toEqual({
        field: 'any_field',
        input: null,
        message: 'should not be null'
      })
    })

    it('returns props with correct values when input is undefined', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = undefined

      const result = sut.create(field, input)

      expect(result.props).toEqual({
        message: 'should not be undefined',
        field: 'any_field',
        input: undefined
      })
    })
  })
})
