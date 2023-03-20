import { printfFunction } from '@/core/3.infra/logging/winston/printf-function'

type SutTypes = {
  sut: typeof printfFunction
}

const makeSut = (): SutTypes => {
  const sut = printfFunction

  return { sut }
}

describe('printfFunction', () => {
  describe('success', () => {
    it('returns correct message when message params is a string', () => {
      const { sut } = makeSut()
      const params = {
        label: 'any_label',
        level: 'any_level',
        message: 'any_message'
      }

      const result = sut(params)

      expect(result).toBe('[any_label] any_level: any_message')
    })

    it('returns correct message when message params is an array', () => {
      const { sut } = makeSut()
      const params = {
        label: 'any_label',
        level: 'any_level',
        message: ['any_message']
      }

      const result = sut(params)

      expect(result).toBe('[any_label] any_level: ["any_message"]')
    })

    it('returns correct message when message params is an object', () => {
      const { sut } = makeSut()
      const params = {
        label: 'any_label',
        level: 'any_level',
        message: { anyKey: 'any_value' }
      }

      const result = sut(params)

      expect(result).toBe('[any_label] any_level: {"anyKey":"any_value"}')
    })
  })
})
