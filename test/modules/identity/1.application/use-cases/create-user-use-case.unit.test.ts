import { DomainError } from '@/common/0.domain/base/domain-error'
import { left, right } from '@/common/0.domain/utils/either'
import { type Encrypter, TokenType } from '@/common/1.application/cryptography/encrypter'
import { type Hasher } from '@/common/1.application/cryptography/hasher'
import { EmailTakenError } from '@/common/1.application/errors/email-taken-error'
import { PasswordMismatchError } from '@/common/1.application/errors/password-mismatch-error'

import { UserAggregate } from '@/identity/0.domain/aggregates/user-aggregate'
import { type UserRepository } from '@/identity/1.application/repositories/user-repository'
import { type CreateUserData, CreateUserUseCase } from '@/identity/1.application/use-cases/create-user-use-case'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'
import { makeEncrypterStub } from '~/common/_doubles/stubs/encrypter-stub'
import { makeHasherStub } from '~/common/_doubles/stubs/hasher-stub'
import { makeUserRepositoryStub } from '~/identity/_doubles/user-repository-stub'

const makeCreateUserDataFake = (): CreateUserData => ({
  email: 'any@mail.com',
  locale: 'en',
  name: 'any_name',
  password: 'any_password',
  passwordRetype: 'any_password'
})

type SutTypes = {
  sut: CreateUserUseCase
  userRepository: UserRepository
  hasher: Hasher
  encrypter: Encrypter
  errorFake: DomainError
  createUserDataFake: CreateUserData
}

const makeSut = (): SutTypes => {
  const doubles = {
    createUserDataFake: makeCreateUserDataFake(),
    errorFake: makeErrorFake()
  }
  const props = {
    encrypter: makeEncrypterStub(),
    hasher: makeHasherStub(),
    userRepository: makeUserRepositoryStub()
  }
  const sut = CreateUserUseCase.create(props)

  return { sut, ...props, ...doubles }
}

describe('CreateUserUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readByEmail with correct params', async () => {
      const { sut, userRepository, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(userRepository.readByEmail).toHaveBeenCalledWith('any@mail.com')
    })

    it('calls Hasher.hash with correct params', async () => {
      const { sut, hasher, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(hasher.hash).toHaveBeenCalledWith('any_password')
    })

    it('calls Encrypter.encrypt with correct params', async () => {
      const { sut, encrypter, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(encrypter.encrypt).toHaveBeenCalledWith({ type: TokenType.email })
    })

    it('calls UserRepository.create with correct params', async () => {
      const { sut, userRepository, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(userRepository.create).toHaveBeenCalledWith(expect.any(UserAggregate))
    })

    it('returns Right with message and email when execute succeeds', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute(createUserDataFake)

      expect(result.isRight()).toBe(true)
      expect(result.value).toEqual({
        email: 'any@mail.com',
        message: 'user created successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns Left with Error when UserRepository fails', async () => {
      const { sut, userRepository, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(createUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with EmailTakenError when email is already in use', async () => {
      const { sut, userRepository, createUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(
        right(UserAggregate.create({
          ...makeCreateUserDataFake(),
          id: 'any_id',
          token: 'any_token'
        }).value as UserAggregate)
      )

      const result = await sut.execute({ ...createUserDataFake })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(EmailTakenError)
    })

    it('returns Left with PasswordMismatchError when passwords do not match', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, passwordRetype: 'anything' })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(PasswordMismatchError)
    })

    it('returns Left with Error when Hasher.hash fails', async () => {
      const { sut, hasher, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when Encrypter.encrypt fails', async () => {
      const { sut, encrypter, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserAggregate.create fails', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, email: 'invalid_email' })

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns Left with Error when UserRepository.create fails', async () => {
      const { sut, userRepository, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'create').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(createUserDataFake)

      expect(result.isLeft()).toBe(true)
      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
