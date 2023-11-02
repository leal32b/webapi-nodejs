import { UserLocale } from '@/identity/0.domain/value-objects/user.locale.value-object'

type SutTypes = {
  sut: typeof UserLocale
}

const makeSut = (): SutTypes => {
  const sut = UserLocale

  return { sut }
}

describe('UserLocale', () => {
  describe('success', () => {
    it('returns UserLocale when input is valid', () => {
      const { sut } = makeSut()
      const input = 'en'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(UserLocale)
    })
  })
})
