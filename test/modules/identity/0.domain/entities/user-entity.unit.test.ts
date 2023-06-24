import { DomainError } from '@/common/0.domain/base/domain-error'
import { Identifier } from '@/common/0.domain/utils/identifier'

import { UserEntity, type UserEntityProps } from '@/identity/0.domain/entities/user-entity'
import { Email } from '@/identity/0.domain/value-objects/email'
import { EmailConfirmed } from '@/identity/0.domain/value-objects/email-confirmed'
import { Name } from '@/identity/0.domain/value-objects/name'
import { Password } from '@/identity/0.domain/value-objects/password'
import { Token } from '@/identity/0.domain/value-objects/token'

const makePropsFake = (): UserEntityProps => ({
  email: 'any@mail.com',
  id: 'any_id',
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

      expect((result.value as UserEntity).email).toBeInstanceOf(Email)
    })

    it('gets emailConfirmed', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).emailConfirmed).toBeInstanceOf(EmailConfirmed)
    })

    it('gets id', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).id).toBeInstanceOf(Identifier)
    })

    it('gets name', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).name).toBeInstanceOf(Name)
    })

    it('gets password', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).password).toBeInstanceOf(Password)
    })

    it('gets token', () => {
      const { sut, propsFake } = makeSut()

      const result = sut.create(propsFake)

      expect((result.value as UserEntity).token).toBeInstanceOf(Token)
    })

    it('sets emailConfirmed', () => {
      const { sut, propsFake } = makeSut()
      const emailConfirmed = EmailConfirmed.create(true).value as EmailConfirmed

      const result = sut.create(propsFake)
      const userEntity = result.value as UserEntity
      userEntity.emailConfirmed = emailConfirmed

      expect(userEntity.emailConfirmed.value).toBe(true)
    })

    it('sets password', () => {
      const { sut, propsFake } = makeSut()
      const password = Password.create('any_password').value as Token

      const result = sut.create(propsFake)
      const userEntity = result.value as UserEntity
      userEntity.password = password

      expect(userEntity.token.value).toBe('any_token')
    })

    it('sets token', () => {
      const { sut, propsFake } = makeSut()
      const token = Token.create('any_token').value as Token

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
        expect.arrayContaining(['Email', 'Name'])
      )
    })
  })
})
