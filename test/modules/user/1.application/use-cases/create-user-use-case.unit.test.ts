import { DomainError } from '@/core/0.domain/base/domain-error'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { left, right } from '@/core/0.domain/utils/either'
import { Identifier } from '@/core/0.domain/utils/identifier'
import { Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { EmailTakenError } from '@/core/1.application/errors/email-taken-error'
import { PasswordMismatchError } from '@/core/1.application/errors/password-mismatch-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserRepository } from '@/user/1.application/repositories/user-repository'
import { CreateUserData, CreateUserUseCase } from '@/user/1.application/use-cases/create-user-use-case'

import { makeErrorFake } from '~/core/fakes/error-fake'
import { makeEncrypterStub } from '~/core/stubs/encrypter-stub'
import { makeHasherStub } from '~/core/stubs/hasher-stub'
import { makeUserRepositoryStub } from '~/user/user-repository-stub'

const makeCreateUserDataFake = (): CreateUserData => ({
  email: 'any@mail.com',
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
  const params = {
    encrypter: makeEncrypterStub(),
    hasher: makeHasherStub(),
    userRepository: makeUserRepositoryStub()
  }
  const sut = CreateUserUseCase.create(params)

  return { sut, ...params, ...doubles }
}

describe('CreateUserUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readByEmail with correct params', async () => {
      const { sut, userRepository, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(userRepository.readByEmail).toHaveBeenCalledWith('any@mail.com')
    })

    it('calls Hasher.hash with correct param', async () => {
      const { sut, hasher, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(hasher.hash).toHaveBeenCalledWith('any_password')
    })

    it('calls Encrypter.encrypt with correct param', async () => {
      const { sut, encrypter, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(encrypter.encrypt).toHaveBeenCalledWith({ type: TokenType.email })
    })

    it('calls UserRepository.create with correct params', async () => {
      const { sut, userRepository, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(userRepository.create).toHaveBeenCalledWith(expect.any(UserAggregate))
    })

    it('calls DomainEvents.dispatchEventsForAggregate with correct params', async () => {
      const { sut, createUserDataFake } = makeSut()
      const dispatchEventsForAggregateSpy = vi.spyOn(DomainEvents, 'dispatchEventsForAggregate')

      await sut.execute(createUserDataFake)

      expect(dispatchEventsForAggregateSpy).toHaveBeenCalledWith(expect.any(Identifier))
    })

    it('returns a message and the created user email', async () => {
      const { sut, createUserDataFake } = makeSut()

      const user = await sut.execute(createUserDataFake)

      expect(user.value).toEqual({
        email: 'any@mail.com',
        message: 'user created successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns an Error when UserRepository fails', async () => {
      const { sut, userRepository, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns EmailTakenError when email is already in use', async () => {
      const { sut, userRepository, createUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(
        right(UserAggregate.create({
          ...makeCreateUserDataFake(),
          id: 'any_id',
          token: 'any_token'
        }).value as UserAggregate)
      )

      const result = await sut.execute({ ...createUserDataFake })

      expect(result.value[0]).toBeInstanceOf(EmailTakenError)
    })

    it('returns PasswordMismatchError when passwords do not match', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, passwordRetype: 'anything' })

      expect(result.value[0]).toBeInstanceOf(PasswordMismatchError)
    })

    it('returns an Error when Hasher.hash fails', async () => {
      const { sut, hasher, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when Encrypter.encrypt fails', async () => {
      const { sut, encrypter, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when UserAggregate.create fails', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, email: 'invalid_email' })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when UserRepository.create fails', async () => {
      const { sut, userRepository, errorFake, createUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'create').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
