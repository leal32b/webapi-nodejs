import Identifier from '@/0.domain/utils/identifier'

type SutTypes = {
  sut: Identifier
  id: string
}

const makeSut = (): SutTypes => {
  const id = 'any_id'
  const sut = new Identifier(id)

  return { sut, id }
}

describe('Identifier', () => {
  describe('success', () => {
    it('returns an Identifier with the same provided id when it is valid', () => {
      const { sut } = makeSut()

      expect(sut.value).toBe('any_id')
    })

    it('returns an Identifier with a new generated id when none is provided', () => {
      const sut = new Identifier()

      expect(sut.value.length).toBe(24)
    })

    it('returns an Identifier with a new generated id when an empty string is provided', () => {
      const sut = new Identifier('')

      expect(sut.value.length).toBe(24)
    })

    it('returns an Identifier with a new generated id when null is provided', () => {
      const sut = new Identifier(null)

      expect(sut.value.length).toBe(24)
    })

    it('returns an Identifier with a new generated id when undefined is provided', () => {
      const sut = new Identifier(undefined)

      expect(sut.value.length).toBe(24)
    })
  })

  describe('failure', () => {

  })
})
