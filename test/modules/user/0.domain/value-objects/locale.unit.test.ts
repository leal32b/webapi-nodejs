import { Locale } from '@/user/0.domain/value-objects/locale'

type SutTypes = {
  sut: typeof Locale
}

const makeSut = (): SutTypes => {
  const sut = Locale

  return { sut }
}

describe('Locale', () => {
  describe('success', () => {
    it('returns a Locale when input is valid', () => {
      const { sut } = makeSut()
      const input = 'en'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Locale)
    })
  })
})
