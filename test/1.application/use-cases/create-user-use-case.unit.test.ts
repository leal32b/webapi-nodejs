import UserAggregate from '@/0.domain/aggregates/user-aggregate'
import DomainError from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import Hasher from '@/1.application/cryptography/hasher'
import TokenGenerator, { TokenType } from '@/1.application/cryptography/token-generator'
import EmailTakenError from '@/1.application/errors/email-taken-error'
import InvalidPasswordError from '@/1.application/errors/invalid-password-error'
import UserRepository from '@/1.application/repositories/user-repository'
import CreateUserUseCase, { CreateUserData } from '@/1.application/use-cases/create-user-use-case'

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

const makeHasherStub = (): Hasher => ({
  hash: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('hashed_password')
  })
})

const makeTokenGeneratorStub = (): TokenGenerator => ({
  generate: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('hashed_password')
  })
})

const makeUserRepositoryStub = (): UserRepository => ({
  create: jest.fn(async (): Promise<Either<DomainError, void>> => {
    return right(null)
  }),
  readByEmail: jest.fn(async (): Promise<Either<DomainError, UserAggregate>> => {
    return right(null)
  }),
  update: jest.fn(async (): Promise<Either<DomainError, void>> => {
    return right(null)
  })
})

type SutTypes = {
  sut: CreateUserUseCase
  hasher: Hasher
  tokenGenerator: TokenGenerator
  userRepository: UserRepository
  errorFake: DomainError
  createUserDataFake: CreateUserData
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    createUserDataFake: makeCreateUserDataFake()
  }
  const injection = {
    hasher: makeHasherStub(),
    tokenGenerator: makeTokenGeneratorStub(),
    userRepository: makeUserRepositoryStub()
  }
  const sut = new CreateUserUseCase(injection)

  return { sut, ...injection, ...fakes }
}

describe('CreateUserUseCase', () => {
  describe('success', () => {
    it('calls Hasher with correct param', async () => {
      const { sut, hasher, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(hasher.hash).toHaveBeenCalledWith(createUserDataFake.password)
    })

    it('calls TokenGenerator with correct param', async () => {
      const { sut, tokenGenerator, createUserDataFake } = makeSut()

      await sut.execute(createUserDataFake)

      expect(tokenGenerator.generate).toHaveBeenCalledWith({ type: TokenType.email })
    })

    it('calls UserRepository with correct params', async () => {
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

    it('returns InvalidPasswordError when passwords do not match', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, passwordRetype: 'anything' })

      expect(result.value[0]).toBeInstanceOf(InvalidPasswordError)
    })

    it('returns an Error when Hasher fails', async () => {
      const { sut, hasher, errorFake, createUserDataFake } = makeSut()
      jest.spyOn(hasher, 'hash').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })

    it('returns an Error when User.create fails', async () => {
      const { sut, createUserDataFake } = makeSut()

      const result = await sut.execute({ ...createUserDataFake, email: 'invalid_email' })

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when CreateUserRepository fails', async () => {
      const { sut, userRepository, errorFake, createUserDataFake } = makeSut()
      jest.spyOn(userRepository, 'create').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(createUserDataFake)

      expect(result.value[0]).toEqual(errorFake)
    })
  })
})
