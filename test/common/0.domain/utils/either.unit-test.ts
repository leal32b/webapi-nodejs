import { type Either, Left, left, Right, right } from '@/common/0.domain/utils/either'

describe('Either', () => {
  describe('success', () => {
    it('creates Left', () => {
      const result = new Left<number, number>(9)

      expect(result).toBeInstanceOf(Left)
    })

    it('creates Right', () => {
      const result = new Right<number, number>(9)

      expect(result).toBeInstanceOf(Right)
    })

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

    it('returns Right with value=undefined when no param is provided', () => {
      const result: Either<any, any> = right()

      expect(result.value).toBe(undefined)
    })

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
