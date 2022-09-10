import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { EmailTakenError } from '@/core/1.application/errors/email-taken-error'
import { PasswordMismatchError } from '@/core/1.application/errors/password-mismatch-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { UserRepository } from '@/user/1.application/repositories/user-repository'
import { CreateUserData, CreateUserUseCase } from '@/user/1.application/use-cases/create-user-use-case'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeCreateUserDataFake = (): CreateUserData => ({
  email: 'any@mail.com',
  name: 'any_name',
  password: 'any_password',
  passwordRetype: 'any_password'
})

const makeUserRepositoryStub = (): UserRepository => ({
  create: jest.fn(async (): Promise<Either<DomainError[], void>> => right(null)),
  readByEmail: jest.fn(async (): Promise<Either<DomainError[], UserAggregate>> => right(null)),
  readById: jest.fn(async (): Promise<Either<DomainError[], UserAggregate>> => right(null)),
  update: jest.fn(async (): Promise<Either<DomainError[], void>> => right(null))
})

const makeHasherStub = (): Hasher => ({
  hash: jest.fn(async (): Promise<Either<DomainError, string>> => right('hashed_password')),
  compare: jest.fn(async (): Promise<Either<DomainError, boolean>> => right(true))
})

const makeEncrypterStub = (): Encrypter => ({
  encrypt: jest.fn(async (): Promise<Either<DomainError, string>> => right('token')),
  decrypt: jest.fn(async (): Promise<Either<DomainError, any>> => right({
    type: TokenType.access,
    payload: {
      anyKey: 'any_value'
    }
  }))
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
    errorFake: makeErrorFake(),
    createUserDataFake: makeCreateUserDataFake()
  }
  const params = {
    userRepository: makeUserRepositoryStub(),
    hasher: makeHasherStub(),
    encrypter: makeEncrypterStub()
  }
  const sut = new CreateUserUseCase(params)

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

      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aggregateRoot: {
            props: {
              email: expect.any(Object),
              emailConfirmed: expect.any(Object),
              id: expect.any(Object),
              name: expect.any(Object),
              password: expect.any(Object),
              token: expect.any(Object)
            }
          }
        })
      )
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
      jest.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })

    it('returns EmailTakenError when email is already in use', async () => {
      const { sut, userRepository, createUserDataFake } = makeSut()
      jest.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(
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
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })

    it('returns an Error when Encrypter.encrypt fails', async () => {
      const { sut, encrypter, errorFake, createUserDataFake } = makeSut()
      jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })

    it('returns an Error when User.create fails', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, email: 'invalid_email' })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when UserRepository.create fails', async () => {
      const { sut, userRepository, errorFake, createUserDataFake } = makeSut()
      jest.spyOn(userRepository, 'create').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })
  })
})
