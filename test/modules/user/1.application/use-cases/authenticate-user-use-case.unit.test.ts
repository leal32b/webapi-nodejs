import { DomainError } from '@/common/0.domain/base/domain-error'
import { left, right } from '@/common/0.domain/utils/either'
import { type Encrypter } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { InvalidPasswordError } from '@/common/1.application/errors/invalid-password-error'
import { NotFoundError } from '@/common/1.application/errors/not-found-error'

import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { Token } from '@/user/0.domain/value-objects/token'
import { type UserRepository } from '@/user/1.application/repositories/user-repository'
import { type AuthenticateUserData, AuthenticateUserUseCase } from '@/user/1.application/use-cases/authenticate-user-use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'
import { makeEncrypterStub } from '~/common/_doubles/stubs/encrypter-stub'
import { makeHasherStub } from '~/common/_doubles/stubs/hasher-stub'
import { makeUserAggregateFake } from '~/user/_doubles/user-aggregate-fake'
import { makeUserRepositoryStub } from '~/user/_doubles/user-repository-stub'

const makeAuthenticateUserDataFake = (): AuthenticateUserData => ({
  email: 'any@mail.com',
  password: 'any_password'
})

type SutTypes = {
  sut: AuthenticateUserUseCase
  userRepository: UserRepository
  hasher: Hasher
  encrypter: Encrypter
  errorFake: DomainError
  authenticateUserDataFake: AuthenticateUserData
}

const makeSut = (): SutTypes => {
  const doubles = {
    authenticateUserDataFake: makeAuthenticateUserDataFake(),
    errorFake: makeErrorFake()
  }
  const props = {
    encrypter: makeEncrypterStub(),
    hasher: makeHasherStub(),
    userRepository: makeUserRepositoryStub()
  }
  const sut = AuthenticateUserUseCase.create(props)
  vi.spyOn(props.userRepository, 'readByEmail').mockResolvedValue(right(makeUserAggregateFake()))

  return { sut, ...props, ...doubles }
}

describe('AuthenticateUserUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readByEmail with correct params', async () => {
      const { sut, userRepository, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(userRepository.readByEmail).toHaveBeenCalledWith('any@mail.com')
    })

    it('calls Hasher.compare with correct params', async () => {
      const { sut, hasher, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(hasher.compare).toHaveBeenCalledWith('hashed_password', 'any_password')
    })

    it('calls Encrypter.encrypt with correct params', async () => {
      const { sut, encrypter, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(encrypter.encrypt).toHaveBeenCalledWith({
        payload: {
          auth: ['user'],
          id: 'any_id'
        },
        type: 'access'
      })
    })

    it('calls UserRepository.update with correct params', async () => {
      const { sut, userRepository, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(userRepository.update).toHaveBeenCalledWith(expect.any(UserAggregate))
    })

    it('returns Right with message and accessToken when execute succeeds', async () => {
      const { sut, authenticateUserDataFake } = makeSut()

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        accessToken: 'token',
        message: 'user authenticated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns Left with Error when UserRepository.readByEmail fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with NotFoundError when userRepository.readByEmail returns null', async () => {
      const { sut, userRepository, authenticateUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(right())

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(NotFoundError)
    })

    it('returns Left with Error when Hasher.compare fails', async () => {
      const { sut, hasher, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(hasher, 'compare').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with InvalidPasswordError when password is invalid', async () => {
      const { sut, hasher, authenticateUserDataFake } = makeSut()
      vi.spyOn(hasher, 'compare').mockResolvedValueOnce(right(false))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(InvalidPasswordError)
    })

    it('returns Left with Error when Encrypter.encrypt fails', async () => {
      const { sut, encrypter, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when Token.create fails', async () => {
      const { sut, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(Token, 'create').mockReturnValueOnce(left([errorFake]))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserRepository.update fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'update').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
