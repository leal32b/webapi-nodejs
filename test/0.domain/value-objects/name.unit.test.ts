import InvalidParamError from '@/0.domain/errors/invalid-param'
import Name from '@/0.domain/value-objects/name'

type SutTypes = {
  sut: typeof Name
}

const makeSut = (): SutTypes => {
  const sut = Name

  return { sut }
}

describe('Name', () => {
  describe('success', () => {
    it('returns a new Name when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_name'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Name)
    })
  })

  describe('failure', () => {
    it('returns at least one error if input is invalid', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(InvalidParamError)
    })

    it('returns an array with errors if validators fail more than once', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(Array.isArray(result.value)).toBeTruthy()
    })
  })
})
