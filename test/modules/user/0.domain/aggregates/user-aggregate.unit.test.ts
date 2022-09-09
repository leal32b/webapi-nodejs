import { NullError } from '@/core/0.domain/errors/null-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserEntityCreateParams } from '@/user/0.domain/entities/user-entity'

const makeParamsFake = (): UserEntityCreateParams => ({
  email: 'any@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'password',
  token: 'any_token'
})

type SutTypes = {
  sut: UserAggregate
  paramsFake: UserEntityCreateParams
}

const makeSut = (): SutTypes => {
  const paramsFake = makeParamsFake()

  const sut = UserAggregate.create(paramsFake).value as UserAggregate

  return { sut, paramsFake }
}

describe('UserAggregate', () => {
  describe('success', () => {
    it('updates the emailConfirmed of aggregateRoot', () => {
      const { sut } = makeSut()

      sut.setEmailConfirmed(true)
      const result = sut.aggregateRoot.emailConfirmed

      expect(result.value).toBe(true)
    })

    it('updates the password of aggregateRoot', () => {
      const { sut } = makeSut()
      const password = 'any_password'

      sut.setPassword(password)
      const result = sut.aggregateRoot.password

      expect(result.value).toBe('any_password')
    })
  })

  describe('failure', () => {
    it('returns Left when params is invalid', () => {
      const params = null

      const result = UserAggregate.create(params)

      expect(result.isLeft()).toBe(true)
    })

    it('returns NullError when params is invalid', () => {
      const params = null

      const result = UserAggregate.create(params)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })

    it('returns NullError when emailConfirmed is null', () => {
      const { sut } = makeSut()

      const result = sut.setEmailConfirmed(null)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })
  })
})
