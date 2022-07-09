import DomainError from '@/0.domain/base/domain-error'
import CreatedAt from '@/0.domain/value-objects/created-at'

type SutTypes = {
  sut: typeof CreatedAt
}

const makeSut = (): SutTypes => {
  const sut = CreatedAt

  return { sut }
}

describe('CreatedAt', () => {
  describe('success', () => {
    it('returns a new CreatedAt', () => {
      const { sut } = makeSut()
      const input = '2022-07-02T22:37:52.000Z'

      const result = sut.create(input)

      expect(result.value).toBeInstanceOf(CreatedAt)
    })
  })

  describe('failure', () => {
    it('returns at least one error when input is invalid', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an array with errors when any validator fails', () => {
      const { sut } = makeSut()
      const input = null

      const result = sut.create(input)

      expect((result.value as any).length).toBeGreaterThanOrEqual(1)
    })
  })
})
