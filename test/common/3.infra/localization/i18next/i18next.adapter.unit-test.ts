import i18next from 'i18next'

import { I18nextAdapter } from '@/common/3.infra/localization/i18next/i18next.adapter'

vi.mock('i18next', () => ({
  default: {
    init: vi.fn(),
    t: () => 'English'
  }
}))

const resourceFake = {
  en: {
    translation: {
      language: 'English'
    }
  }
}

type SutTypes = {
  sut: I18nextAdapter
}

const makeSut = (): SutTypes => {
  const sut = I18nextAdapter.create(resourceFake)

  return { sut }
}

describe('I18nextAdapter', () => {
  describe('success', () => {
    it('calls i18n.t with correct params', () => {
      const { sut } = makeSut()
      const tSpy = vi.spyOn(i18next, 't')
      const key = 'language'
      const opt = { lng: 'en' }

      sut.t(key, opt)

      expect(tSpy).toHaveBeenCalledWith('language', { lng: 'en' })
    })

    it('returns a translated key', async () => {
      const { sut } = makeSut()
      const key = 'language'

      const result = sut.t(key)

      expect(result).toBe('English')
    })
  })
})
