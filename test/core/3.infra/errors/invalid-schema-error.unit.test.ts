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
    it('returns an InvalidSchemaError', () => {
      const { sut } = makeSut()

      const result = sut.create()

      expect(result).toBeInstanceOf(InvalidSchemaError)
    })

    it('returns props with correct values', () => {
      const { sut } = makeSut()

      const result = sut.create()

      expect(result.props).toEqual({
        message: 'schema is invalid'
      })
    })
  })
})
