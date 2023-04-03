import { InvalidSchemaError } from '@/core/3.infra/errors/invalid-schema-error'

type SutTypes = {
  sut: typeof InvalidSchemaError
}

const makeSut = (): SutTypes => {
  const sut = InvalidSchemaError

  return { sut }
}

describe('InvalidSchemaError', () => {
  describe('success', () => {
    it('returns an InvalidSchemaError with correct props', () => {
      const { sut } = makeSut()

      const result = sut.create()

      expect(result).toBeInstanceOf(InvalidSchemaError)
      expect(result.props).toEqual({ message: 'schema is invalid' })
    })
  })
})
