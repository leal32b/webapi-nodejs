import { UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { type UserEntity } from '@/identity/0.domain/entities/user-entity'

import { makeUserEntityFake } from '~/identity/_doubles/user-entity-fake'

type SutTypes = {
  userEntityFake: UserEntity
  sut: typeof UserAggregate
}

const makeSut = (): SutTypes => {
  const doubles = {
    userEntityFake: makeUserEntityFake()
  }
  const sut = UserAggregate

  return {
    ...doubles,
    sut
  }
}

describe('UserAggregate', () => {
  describe('success', () => {
    it('returns UserAggregate when UserEntity is valid', () => {
      const { sut, userEntityFake } = makeSut()

      const result = sut.create(userEntityFake)

      expect(result).toBeInstanceOf(UserAggregate)
    })
  })
})
