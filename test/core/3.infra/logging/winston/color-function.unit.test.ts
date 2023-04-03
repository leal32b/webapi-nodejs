import { colorFunction } from '@/core/3.infra/logging/winston/color-function'

type SutTypes = {
  sut: typeof colorFunction
}

const makeSut = (): SutTypes => {
  const sut = colorFunction

  return { sut }
}

describe('colorFunction', () => {
  describe('success', () => {
    it('returns formatted label when it is communication', () => {
      const { sut } = makeSut()
      const label = 'communication'

      const result = sut(label)

      expect(result).toBe(`\x1b[33m${label}\x1b[0m`)
    })

    it('returns formatted label when it is events', () => {
      const { sut } = makeSut()
      const label = 'events'

      const result = sut(label)

      expect(result).toBe('\x1b[34mevents\x1b[0m')
    })

    it('returns formatted label when it is persistence', () => {
      const { sut } = makeSut()
      const label = 'persistence'

      const result = sut(label)

      expect(result).toBe(`\x1b[36m${label}\x1b[0m`)
    })

    it('returns formatted label when it is webapp', () => {
      const { sut } = makeSut()
      const label = 'webapp'

      const result = sut(label)

      expect(result).toBe(`\x1b[35m${label}\x1b[0m`)
    })
  })

  describe('failure', () => {
    it('returns passed label when it throws', async () => {
      const { sut } = makeSut()
      const label = 'invalid_label'

      const result = sut(label)

      expect(result).toBe('invalid_label')
    })
  })
})
