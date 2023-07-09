import { NameTakenError } from '@/common/1.application/errors/name-taken.error'

type SutTypes = {
  sut: typeof NameTakenError
}

const makeSut = (): SutTypes => {
  const sut = NameTakenError

  return { sut }
}

describe('NameTakenError', () => {
  describe('success', () => {
    it('returns a NameTakenError with correct props', () => {
      const { sut } = makeSut()
      const field = 'any_field'
      const input = 'any_name'

      const result = sut.create(field, input)

      expect(result).toBeInstanceOf(NameTakenError)
      expect(result.props).toEqual({
        field: 'any_field',
        input: 'any_name',
        message: 'name already in use'
      })
    })
  })
})
