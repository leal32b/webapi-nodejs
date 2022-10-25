import { Identifier } from '@/core/0.domain/utils/identifier'

type SutTypes = {
  sut: typeof Identifier
}

const makeSut = (): SutTypes => {
  const sut = Identifier

  return { sut }
}

describe('Identifier', () => {
  describe('success', () => {
    it('returns an Identifier with a new generated id when none is provided', () => {
      const { sut } = makeSut()

      const result = new sut()

      expect(result.value).toEqual(expect.any(String))
    })

    it('returns an Identifier with the same provided id when it is provided', () => {
      const { sut } = makeSut()
      const id = 'any_id'

      const result = new sut({ id })

      expect(result.value).toBe('any_id')
    })

    it('returns an Identifier with a new generated id when an empty string is provided', () => {
      const { sut } = makeSut()
      const id = ''

      const result = new sut({ id })

      expect(result.value).toEqual(expect.any(String))
    })

    it('returns an Identifier with a new generated id when null is provided', () => {
      const { sut } = makeSut()
      const id = null

      const result = new sut({ id })

      expect(result.value).toEqual(expect.any(String))
    })

    it('returns an Identifier with a new generated id when undefined is provided', () => {
      const { sut } = makeSut()
      const id = undefined

      const result = new sut({ id })

      expect(result.value).toEqual(expect.any(String))
    })

    it('returns an Identifier with defaultOptions applied when none is provided', () => {
      const { sut } = makeSut()
      const regex = /^[a-zA-Z0-9]{24}$/

      const result = new sut()

      expect(regex.test(result.value)).toBe(true)
    })

    it('returns an Identifier with options applied when it is provided', () => {
      const { sut } = makeSut()
      const alphabet = 'abc123'
      const length = 6
      const regex = /^[a-c1-3]{6}$/

      const result = new sut({
        options: { alphabet, length }
      })

      expect(regex.test(result.value)).toBe(true)
    })
  })
})
