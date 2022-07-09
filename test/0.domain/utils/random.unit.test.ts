import Random from '@/0.domain/utils/random'

type SutTypes = {
  sut: Random
}

const makeSut = (): SutTypes => {
  const sut = new Random()

  return { sut }
}

describe('Random', () => {
  describe('success', () => {
    it('returns a random number', () => {
      const { sut } = makeSut()

      const result = sut.nextInt()

      expect(typeof result).toBe('number')
    })

    it('returns a random double', () => {
      const { sut } = makeSut()

      const result = sut.nextDouble()

      expect(result % 1).not.toBe(0)
    })
  })
})
