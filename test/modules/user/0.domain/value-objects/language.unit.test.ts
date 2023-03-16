import { NullError } from '@/core/0.domain/errors/null-error'
import { LanguageEnum } from '@/user/0.domain/enums/language-enum'
import { Language } from '@/user/0.domain/value-objects/language'

type SutTypes = {
  sut: typeof Language
}

const makeSut = (): SutTypes => {
  const sut = Language

  return { sut }
}

describe('Language', () => {
  describe('success', () => {
    it('returns a Language when input is valid', () => {
      const { sut } = makeSut()
      const input = LanguageEnum.en

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(Language)
    })
  })

  describe('failure', () => {
    it('returns NullError when input is null', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })
  })
})
