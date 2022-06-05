import InvalidParamError from '@/0.domain/errors/invalid-param'
import Id from '@/0.domain/value-objects/id'

type SutTypes = {
  sut: typeof Id
}

const makeSut = (): SutTypes => {
  const sut = Id

  return { sut }
}

describe('Id', () => {
  describe('success', () => {
    it('returns a new Id when input is valid', () => {
      const { sut } = makeSut()
      const input = 'any_id'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Id)
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
