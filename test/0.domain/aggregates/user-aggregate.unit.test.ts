import UserAggregate from '@/0.domain/aggregates/user-aggregate'
import UserEntity, { UserEntityCreateParams } from '@/0.domain/entities/user/user-entity'
import NullError from '@/0.domain/errors/null-error'

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
  const fakes = {
    paramsFake: makeParamsFake()
  }

  const sut = UserAggregate.create(fakes.paramsFake).value as UserAggregate

  return { sut, ...fakes }
}

describe('UserAggregate', () => {
  describe('success', () => {
    it('gets the aggregateRoot', () => {
      const { sut } = makeSut()

      const result = sut.aggregateRoot

      expect(result).toBeInstanceOf(UserEntity)
    })

    it('updates the emailConfirmed of aggregateRoot', () => {
      const { sut } = makeSut()

      sut.setEmailConfirmed(true)
      const result = sut.aggregateRoot.emailConfirmed

      expect(result.value).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns NullError when emailConfirmed is null', () => {
      const { sut } = makeSut()

      const result = sut.setEmailConfirmed(null)

      expect(result.value[0]).toBeInstanceOf(NullError)
    })
  })
})