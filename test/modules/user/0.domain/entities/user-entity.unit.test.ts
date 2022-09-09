import { DomainError } from '@/core/0.domain/base/domain-error'
import { NullError } from '@/core/0.domain/errors/null-error'
import { Identifier } from '@/core/0.domain/utils/identifier'
import { UserEntity, UserEntityCreateParams } from '@/user/0.domain/entities/user-entity'
import { Email } from '@/user/0.domain/value-objects/email'
import { EmailConfirmed } from '@/user/0.domain/value-objects/email-confirmed'
import { Name } from '@/user/0.domain/value-objects/name'
import { Password } from '@/user/0.domain/value-objects/password'
import { Token } from '@/user/0.domain/value-objects/token'

const makeParamsFake = (): UserEntityCreateParams => ({
  email: 'any@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'password',
  token: 'any_token'
})

type SutTypes = {
  sut: typeof UserEntity
  paramsFake: UserEntityCreateParams
}

const makeSut = (): SutTypes => {
  const doubles = {
    paramsFake: makeParamsFake()
  }
  const sut = UserEntity

  return { sut, ...doubles }
}

describe('UserEntity', () => {
  describe('success', () => {
    it('returns an User when params are valid', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect(result.value).toBeInstanceOf(UserEntity)
    })

    it('returns an User with emailConfirmed=true when it is passed', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create({
        ...paramsFake,
        emailConfirmed: true
      })

      expect((result.value as UserEntity).emailConfirmed.value).toBe(true)
    })

    it('gets email prop', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserEntity).email).toBeInstanceOf(Email)
    })

    it('gets emailConfirmed prop', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserEntity).emailConfirmed).toBeInstanceOf(EmailConfirmed)
    })

    it('sets emailConfirmed prop', () => {
      const { sut, paramsFake } = makeSut()
      const emailConfirmed = EmailConfirmed.create(true).value as EmailConfirmed

      const result = sut.create(paramsFake)
      const userEntity = result.value as UserEntity
      userEntity.emailConfirmed = emailConfirmed

      expect(userEntity.emailConfirmed.value).toBe(true)
    })

    it('gets id prop', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserEntity).id).toBeInstanceOf(Identifier)
    })

    it('gets name prop', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserEntity).name).toBeInstanceOf(Name)
    })

    it('gets password prop', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserEntity).password).toBeInstanceOf(Password)
    })

    it('sets password prop', () => {
      const { sut, paramsFake } = makeSut()
      const password = Password.create('any_password').value as Token

      const result = sut.create(paramsFake)
      const userEntity = result.value as UserEntity
      userEntity.password = password

      expect(userEntity.token.value).toBe('any_token')
    })

    it('gets token prop', () => {
      const { sut, paramsFake } = makeSut()

      const result = sut.create(paramsFake)

      expect((result.value as UserEntity).token).toBeInstanceOf(Token)
    })

    it('sets token prop', () => {
      const { sut, paramsFake } = makeSut()
      const token = Token.create('any_token').value as Token

      const result = sut.create(paramsFake)
      const userEntity = result.value as UserEntity
      userEntity.token = token

      expect(userEntity.token.value).toBe('any_token')
    })
  })

  describe('failure', () => {
    it('returns Left when params is invalid', () => {
      const { sut } = makeSut()
      const params = null

      const result = sut.create(params)

      expect(result.isLeft()).toBe(true)
    })

    it('returns NullError when params is null', () => {
      const { sut } = makeSut()
      const params = null

      const result = sut.create(params)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })

    it('returns NullError when params is undefined', () => {
      const { sut } = makeSut()
      const params = undefined

      const result = sut.create(params)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })

    it('returns Left when any param is invalid', () => {
      const { sut, paramsFake } = makeSut()
      const email = null

      const result = sut.create({ ...paramsFake, email })

      expect(result.isLeft()).toBeTruthy()
    })

    it('returns an array of errors when any param is invalid', () => {
      const { sut, paramsFake } = makeSut()
      const email = null

      const result = sut.create({ ...paramsFake, email })

      expect((result.value as DomainError[])
        .every(item => item instanceof DomainError)).toBe(true)
    })

    it('returns an error for each param validation that fails', () => {
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