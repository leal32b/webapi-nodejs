import { DomainError } from '@/core/0.domain/base/domain-error'
import { Identifier } from '@/core/0.domain/utils/identifier'
import { UserEntity, UserEntityCreateParams } from '@/modules/user/0.domain/entities/user-entity'
import { Email } from '@/modules/user/0.domain/value-objects/email'
import { EmailConfirmed } from '@/modules/user/0.domain/value-objects/email-confirmed'
import { Name } from '@/modules/user/0.domain/value-objects/name'
import { Password } from '@/modules/user/0.domain/value-objects/password'
import { Token } from '@/modules/user/0.domain/value-objects/token'

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
  const fakes = {
    paramsFake: makeParamsFake()
  }
  const sut = UserEntity

  return { sut, ...fakes }
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

      expect((result.value as DomainError[])[0]).toBeInstanceOf(DomainError)
    })

    it('returns an error for each param validation tha failed', () => {
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
