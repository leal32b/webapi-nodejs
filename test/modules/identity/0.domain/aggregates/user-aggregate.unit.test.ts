import { DomainError } from '@/common/0.domain/base/domain-error'
import { Identifier } from '@/common/0.domain/utils/identifier'

import { UserAggregate, type UserAggregateProps } from '@/identity/0.domain/aggregates/user-aggregate'
import { Email } from '@/identity/0.domain/value-objects/email'
import { EmailConfirmed } from '@/identity/0.domain/value-objects/email-confirmed'
import { Name } from '@/identity/0.domain/value-objects/name'
import { Password } from '@/identity/0.domain/value-objects/password'
import { Token } from '@/identity/0.domain/value-objects/token'

const makeParamsFake = (): UserAggregateProps => ({
  email: 'any@mail.com',
  id: 'any_id',
  locale: 'en',
  name: 'any_name',
  password: 'password',
  token: 'any_token'
})

type SutTypes = {
  paramsFake: UserAggregateProps
  sut: typeof UserAggregate
}

const makeSut = (): SutTypes => {
  const doubles = {
    paramsFake: makeParamsFake()
  }
  const sut = UserAggregate

  return {
    ...doubles,
    sut
  }
}

describe('UserAggregate', () => {
  describe('success', () => {
    it('returns User when params are valid', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect(result.value).toBeInstanceOf(UserAggregate)
    })

    it('returns User with emailConfirmed=true when it is passed', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create({
        ...paramsFake,
        emailConfirmed: true
      })

      expect((result.value as UserAggregate).emailConfirmed.value).toBe(true)
    })

    it('gets email', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserAggregate).email).toBeInstanceOf(Email)
    })

    it('gets emailConfirmed', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserAggregate).emailConfirmed).toBeInstanceOf(EmailConfirmed)
    })

    it('gets id', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserAggregate).id).toBeInstanceOf(Identifier)
    })

    it('gets name', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserAggregate).name).toBeInstanceOf(Name)
    })

    it('gets password', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserAggregate).password).toBeInstanceOf(Password)
    })

    it('gets token', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserAggregate).token).toBeInstanceOf(Token)
    })

    it('sets emailConfirmed', () => {
      const { sut, paramsFake } = makeSut()
      const emailConfirmed = EmailConfirmed.create(true).value as EmailConfirmed

      const result = sut.create(paramsFake)
      const userEntity = result.value as UserAggregate
      userEntity.emailConfirmed = emailConfirmed

      expect(userEntity.emailConfirmed.value).toBe(true)
    })

    it('sets password', () => {
      const { sut, paramsFake } = makeSut()
      const password = Password.create('any_password').value as Token

      const result = sut.create(paramsFake)
      const userEntity = result.value as UserAggregate
      userEntity.password = password

      expect(userEntity.token.value).toBe('any_token')
    })

    it('sets token', () => {
      const { sut, paramsFake } = makeSut()
      const token = Token.create('any_token').value as Token

      const result = sut.create(paramsFake)
      const userEntity = result.value as UserAggregate
      userEntity.token = token

      expect(userEntity.token.value).toBe('any_token')
    })
  })

  describe('failure', () => {
    it('returns Left with an array of Errors when any param is invalid', () => {
      const { sut, paramsFake } = makeSut()
      const email = null

      const result = sut.create({ ...paramsFake, email })

      expect(result.isLeft()).toBe(true)
      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })

    it('returns an Error for each param validation that fails', () => {
      const { sut, paramsFake } = makeSut()
      const email = null
      const name = null

      const result = sut.create({ ...paramsFake, email, name })

      expect((result.value as DomainError[]).map(error => error.props.field)).toEqual(
        expect.arrayContaining(['Email', 'Name'])
      )
    })
  })
})
