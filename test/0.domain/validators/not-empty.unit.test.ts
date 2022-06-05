import InvalidParamError from '@/0.domain/errors/invalid-param'
import NotEmptyValidator from '@/0.domain/validators/not-empty'

type SutTypes = {
  sut: NotEmptyValidator
}

const makeSut = (): SutTypes => {
  const sut = new NotEmptyValidator()

  return { sut }
}

describe('NotEmptyValidator', () => {
  describe('success', () => {
    it('returns null when input is not empty', () => {
      const { sut } = makeSut()
      const input = 'anything'

      const result = sut.validate(input)

      expect(result.value).toBeNull()
    })
  })

  describe('failure', () => {
    it('returns InvalidParamError when input is a empty string', () => {
      const { sut } = makeSut()
      const input = ''

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('isEmpty'))
    })

    it('returns InvalidParamError when input is null', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('isEmpty'))
    })

    it('returns InvalidParamError when input is undefined', () => {
      const { sut } = makeSut()
      const input = undefined

      const result = sut.validate(input)

      expect(result.value).toEqual(new InvalidParamError('isEmpty'))
    })
  })
})
