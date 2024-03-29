import { Random } from '@/common/0.domain/utils/random'

type SutTypes = {
  sut: Random
}

const makeSut = (): SutTypes => {
  const sut = Random.create()

  return { sut }
}

describe('Random', () => {
  describe('success', () => {
    it('returns a random number with defaultOptions applied when none is provided', () => {
      const { sut } = makeSut()

      const result = sut.nextInt()

      expect(typeof result).toBe('number')
    })

    it('returns a random number with options applied when it is provided', () => {
      const sut = Random.create({
        options: {
          incrementor: 0,
          modulus: 64,
          multiplier: 13
        },
        seed: 1
      })

      const result = sut.nextInt()

      expect(result).toBe(13)
    })
  })
})
