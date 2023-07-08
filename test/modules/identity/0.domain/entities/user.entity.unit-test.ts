import { DomainError } from '@/common/0.domain/base/domain-error'

import { UserEntity, type UserEntityProps } from '@/identity/0.domain/entities/user.entity'
import { UserEmailConfirmed } from '@/identity/0.domain/value-objects/user.email-confirmed.value-object'
import { UserEmail } from '@/identity/0.domain/value-objects/user.email.value-object'
import { UserName } from '@/identity/0.domain/value-objects/user.name.value-object'
import { UserPassword } from '@/identity/0.domain/value-objects/user.password.value-object'
import { UserToken } from '@/identity/0.domain/value-objects/user.token.value-object'

const makePropsFake = (): UserEntityProps => ({
  email: 'any@mail.com',
  locale: 'en',
  name: 'any_name',
  password: 'password',
  token: 'any_token'
})

type SutTypes = {
  propsFake: UserEntityProps
  sut: typeof UserEntity
}

const makeSut = (): SutTypes => {
  const doubles = {
    propsFake: makePropsFake()
  }
  const sut = UserEntity

  return {
    ...doubles,
    sut
  }
}

describe('UserEntity', () => {
  describe('success', () => {
    it('returns UserEntity when props are valid', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect(result.value).toBeInstanceOf(UserEntity)
    })

    it('returns UserEntity with emailConfirmed=true when it is passed', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create({
        ...propsFake,
        emailConfirmed: true
      })

      expect((result.value as UserEntity).emailConfirmed.value).toBe(true)
    })

    it('gets email', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).email).toBeInstanceOf(UserEmail)
    })

    it('gets emailConfirmed', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).emailConfirmed).toBeInstanceOf(UserEmailConfirmed)
    })

    it('gets id', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect(typeof (result.value as UserEntity).id).toBe('string')
    })

    it('gets name', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).name).toBeInstanceOf(UserName)
    })

    it('gets password', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).password).toBeInstanceOf(UserPassword)
    })

    it('gets token', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).token).toBeInstanceOf(UserToken)
    })

    it('sets emailConfirmed', () => {
      const { sut, propsFake } = makeSut()
      const emailConfirmed = UserEmailConfirmed.create(true).value as UserEmailConfirmed

      const result = sut.create(propsFake)
      const userEntity = result.value as UserEntity
      userEntity.emailConfirmed = emailConfirmed

      expect(userEntity.emailConfirmed.value).toBe(true)
    })

    it('sets password', () => {
      const { sut, propsFake } = makeSut()
      const password = UserPassword.create('any_password').value as UserToken

      const result = sut.create(propsFake)
      const userEntity = result.value as UserEntity
      userEntity.password = password

      expect(userEntity.token.value).toBe('any_token')
    })

    it('sets token', () => {
      const { sut, propsFake } = makeSut()
      const token = UserToken.create('any_token').value as UserToken

      const result = sut.create(propsFake)
      const userEntity = result.value as UserEntity
      userEntity.token = token

      expect(userEntity.token.value).toBe('any_token')
    })
  })

  describe('failure', () => {
    it('returns Left with an array of Errors when any prop is invalid', () => {
      const { sut, propsFake } = makeSut()
      const email = null

      const result = sut.create({ ...propsFake, email })

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })

    it('returns an Error for each prop validation that fails', () => {
      const { sut, propsFake } = makeSut()
      const email = null
      const name = null

      const result = sut.create({ ...propsFake, email, name })

      expect((result.value as DomainError[]).map(error => error.props.field)).toEqual(
        expect.arrayContaining(['UserEmail', 'UserName'])
      )
    })
  })
})
