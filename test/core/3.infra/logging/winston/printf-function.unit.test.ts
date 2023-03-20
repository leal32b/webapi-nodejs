import { printfFunction } from '@/core/3.infra/logging/winston/printf-function'

type SutTypes = {
  sut: typeof printfFunction
}

const makeSut = (): SutTypes => {
  const sut = printfFunction

  return { sut }
}

const lineBreakAndDoubleSpace = /(\r\n|\n|\r|\s\s+)/gm

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

    it('returns correct message when message params is an array of strings', () => {
      const { sut } = makeSut()
      const params = {
        label: 'any_label',
        level: 'any_level',
        message: ['any_message', 'another_string']
      }

      const result = sut(params)

      expect(result).toBe('[any_label] any_level: any_message another_string')
    })

    it('returns correct message when message params is an array of strings and objects', () => {
      const { sut } = makeSut()
      const params = {
        label: 'any_label',
        level: 'any_level',
        message: ['any_message', { anyKey: 'any_value' }]
      }

      const result = sut(params)

      expect(result.replace(lineBreakAndDoubleSpace, '')).toBe('[any_label] any_level: any_message {anyKey: "any_value"}')
    })

    it('returns correct message when message params is an array of objects and strings', () => {
      const { sut } = makeSut()
      const params = {
        label: 'any_label',
        level: 'any_level',
        message: [{ anyKey: 'any_value' }, 'any_message']
      }

      const result = sut(params)

      expect(result.replace(lineBreakAndDoubleSpace, '')).toBe('[any_label] any_level: {anyKey: "any_value"} any_message')
    })

    it('returns correct message when message params is an object', () => {
      const { sut } = makeSut()
      const params = {
        label: 'any_label',
        level: 'any_level',
        message: { anyKey: 'any_value' }
      }

      const result = sut(params)

      expect(result.replace(lineBreakAndDoubleSpace, '')).toBe('[any_label] any_level: {anyKey: "any_value"}')
    })
  })
})
