import { ValueObject } from '@/common/0.domain/base/value-object'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { GroupEntity } from '@/identity/0.domain/entities/group.entity'
import { type UserEntity } from '@/identity/0.domain/entities/user.entity'
import { UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed.value-object'
import { UserPassword } from '@/identity/0.domain/value-objects/user.password.value-object'
import { UserToken } from '@/identity/0.domain/value-objects/user.token.value-object'

import { makeGroupEntityFake } from '~/identity/_doubles/fakes/group-entity.fake'
import { makeUserEntityFake } from '~/identity/_doubles/fakes/user-entity.fake'

type SutTypes = {
  groupEntityFake: GroupEntity
  userEntityFake: UserEntity
  sut: typeof UserAggregate
}

const makeSut = (): SutTypes => {
  const doubles = {
    groupEntityFake: makeGroupEntityFake(),
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

    it('sets emailConfirmed', () => {
      const { sut, userEntityFake } = makeSut()
      const emailConfirmed = UserEmailConfirmed.create(true).value as UserEmailConfirmed

      const result = sut.create(userEntityFake)
      result.setEmailConfirmed(emailConfirmed)

      expect(result.aggregateRoot.emailConfirmed.value).toBe(true)
    })

    it('sets groups', () => {
      const { sut, groupEntityFake, userEntityFake } = makeSut()
      const groups = [groupEntityFake]

      const result = sut.create(userEntityFake)
      result.setGroups(groups)

      expect(result.groups.every(item => item instanceof GroupEntity)).toBe(true)
    })

    it('sets groups when param is undefined', () => {
      const { sut, userEntityFake } = makeSut()
      const groups = undefined

      const result = sut.create(userEntityFake)
      result.setGroups(groups)

      expect(result.groups.every(item => item instanceof GroupEntity)).toBe(true)
    })

    it('sets password', () => {
      const { sut, userEntityFake } = makeSut()
      const password = UserPassword.create('any_password').value as UserToken

      const result = sut.create(userEntityFake)
      result.setPassword(password)

      expect(result.aggregateRoot.password.value).toBe('any_password')
    })

    it('sets token', () => {
      const { sut, userEntityFake } = makeSut()
      const token = UserToken.create('any_token').value as UserToken

      const result = sut.create(userEntityFake)
      result.setToken(token)

      expect(result.aggregateRoot.token.value).toBe('any_token')
    })

    it('gets aggregateRoot', () => {
      const { sut, userEntityFake } = makeSut()

      const result = sut.create(userEntityFake)

      expect(result.aggregateRoot).toEqual({
        createdAt: expect.any(Date),
        email: expect.any(ValueObject),
        emailConfirmed: expect.any(ValueObject),
        id: expect.any(String),
        locale: expect.any(ValueObject),
        name: expect.any(ValueObject),
        password: expect.any(ValueObject),
        token: expect.any(ValueObject),
        updatedAt: expect.any(Date)
      })
    })

    it('gets groups', () => {
      const { sut, groupEntityFake, userEntityFake } = makeSut()
      const additional = { groups: [groupEntityFake] }

      const result = sut.create(userEntityFake, additional)

      expect(result.groups.every(item => item instanceof GroupEntity)).toBe(true)
    })
  })
})
