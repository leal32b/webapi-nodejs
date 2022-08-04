import { Either, left, right } from '@/core/0.domain/utils/either'

describe('Either', () => {
  describe('success', () => {
    it('returns true on isRight when it is right', () => {
      const result: Either<any, any> = right('anything')

      expect(result.isRight()).toBe(true)
    })

    it('returns false on isRight when it is left', () => {
      const result: Either<any, any> = left('anything')

      expect(result.isRight()).toBe(false)
    })

    it('returns Right on appliesOnRight when it is Right', () => {
      const result: Either<any, any> = right('anything')

      expect(result.applyOnRight(value => value).isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns true on isLeft when it is left', () => {
      const result: Either<any, any> = left('anything')

      expect(result.isLeft()).toBe(true)
    })

    it('returns false on isLeft when it is right', () => {
      const result: Either<any, any> = right('anything')

      expect(result.isLeft()).toBe(false)
    })

    it('returns Left on appliesOnRight when it is Left', () => {
      const result: Either<any, any> = left('anything')

      expect(result.applyOnRight(value => value).isLeft()).toBe(true)
    })
  })
})
