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

      const result = new sut()

      expect(result).toBeInstanceOf(InvalidSchemaError)
    })

    it('returns an InvalidSchemaError with correct message', () => {
      const { sut } = makeSut()

      const result = new sut()

      expect(result.props.message).toBe('schema is invalid')
    })
  })
})
