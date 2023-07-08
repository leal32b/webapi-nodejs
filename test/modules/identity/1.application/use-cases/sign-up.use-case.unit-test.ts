import { DomainError } from '@/common/0.domain/base/domain-error'
import { left, right } from '@/common/0.domain/utils/either'
import { type Encrypter, TokenType } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { EmailTakenError } from '@/common/1.application/errors/email-taken.error'
import { PasswordMismatchError } from '@/common/1.application/errors/password-mismatch.error'

import { UserAggregate } from '@/identity/0.domain/aggregates/user.aggregate'
import { UserEntity } from '@/identity/0.domain/entities/user.entity'
import { type UserRepository } from '@/identity/1.application/repositories/user.repository'
import { type SignUpData, SignUpUseCase } from '@/identity/1.application/use-cases/sign-up.use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'
import { makeEncrypterStub } from '~/common/_doubles/stubs/encrypter.stub'
import { makeHasherStub } from '~/common/_doubles/stubs/hasher.stub'
import { makeUserRepositoryStub } from '~/identity/_doubles/stubs/user-repository.stub'

const makeSignUpDataFake = (): SignUpData => ({
  email: 'any@mail.com',
  locale: 'en',
  name: 'any_name',
  password: 'any_password',
  passwordRetype: 'any_password'
})

type SutTypes = {
  errorFake: DomainError
  signUpDataFake: SignUpData
  encrypter: Encrypter
  hasher: Hasher
  userRepository: UserRepository
  sut: SignUpUseCase
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    signUpDataFake: makeSignUpDataFake()
  }
  const props = {
    encrypter: makeEncrypterStub(),
    hasher: makeHasherStub(),
    userRepository: makeUserRepositoryStub()
  }
  const sut = SignUpUseCase.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('SignUpUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readByEmail with correct params', async () => {
      const { sut, userRepository, signUpDataFake } = makeSut()

      await sut.execute(signUpDataFake)

      expect(userRepository.readByEmail).toHaveBeenCalledWith('any@mail.com')
    })

    it('calls Hasher.hash with correct params', async () => {
      const { sut, hasher, signUpDataFake } = makeSut()

      await sut.execute(signUpDataFake)

      expect(hasher.hash).toHaveBeenCalledWith('any_password')
    })

    it('calls Encrypter.encrypt with correct params', async () => {
      const { sut, encrypter, signUpDataFake } = makeSut()

      await sut.execute(signUpDataFake)

      expect(encrypter.encrypt).toHaveBeenCalledWith({ type: TokenType.email })
    })

    it('calls UserRepository.create with correct params', async () => {
      const { sut, userRepository, signUpDataFake } = makeSut()

      await sut.execute(signUpDataFake)

      expect(userRepository.create).toHaveBeenCalledWith(expect.any(UserAggregate))
    })

    it('returns Right with message and email when execute succeeds', async () => {
      const { sut, signUpDataFake } = makeSut()

      const result = await sut.execute(signUpDataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        email: 'any@mail.com',
        message: 'user signed up successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns Left with Error when UserRepository.readByEmail fails', async () => {
      const { sut, userRepository, errorFake, signUpDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(signUpDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with EmailTakenError when email is already in use', async () => {
      const { sut, userRepository, signUpDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(
        right(UserAggregate.create(
          UserEntity.create({
            ...signUpDataFake,
            token: 'any_token'
          }).value as UserEntity
        ))
      )

      const result = await sut.execute(signUpDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(EmailTakenError)
    })

    it('returns Left with PasswordMismatchError when passwords do not match', async () => {
      const { sut, signUpDataFake } = makeSut()

      const result = await sut.execute({ ...signUpDataFake, passwordRetype: 'anything' })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(PasswordMismatchError)
    })

    it('returns Left with Error when Hasher.hash fails', async () => {
      const { sut, hasher, errorFake, signUpDataFake } = makeSut()
      vi.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(signUpDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when Encrypter.encrypt fails', async () => {
      const { sut, encrypter, errorFake, signUpDataFake } = makeSut()
      vi.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(signUpDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserEntity.create fails', async () => {
      const { sut, signUpDataFake } = makeSut()

      const result = await sut.execute({ ...signUpDataFake, email: 'invalid_email' })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserRepository.create fails', async () => {
      const { sut, userRepository, errorFake, signUpDataFake } = makeSut()
      vi.spyOn(userRepository, 'create').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(signUpDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
