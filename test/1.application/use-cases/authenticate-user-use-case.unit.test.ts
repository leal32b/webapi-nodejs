import UserAggregate from '@/0.domain/aggregates/user-aggregate'
import DomainError from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import HashComparer from '@/1.application/cryptography/hash-comparer'
import TokenGenerator from '@/1.application/cryptography/token-generator'
import UserRepository from '@/1.application/repositories/user-repository'
import AuthenticateUserUseCase, { AuthenticateUserData } from '@/1.application/use-cases/authenticate-user-use-case'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeAuthenticateUserDataFake = (): AuthenticateUserData => ({
  email: 'any@mail.com',
  password: 'password'
})

const makeHashComparerStub = (): HashComparer => ({
  compare: jest.fn(async (): Promise<Either<DomainError, void>> => right(null))
})

const makeUserRepositoryStub = (): UserRepository => ({
  create: jest.fn(async (): Promise<Either<DomainError, void>> => {
    return right(null)
  }),
  readByEmail: jest.fn(async (): Promise<Either<DomainError, UserAggregate>> => {
    return right(UserAggregate.create({
      email: 'any@mail.com',
      id: 'any_id',
      name: 'any_name',
      password: 'hashed_password',
      token: 'any_token'
    }).value as UserAggregate)
  }),
  update: jest.fn(async (): Promise<Either<DomainError, void>> => {
    return right(null)
  })
})

const makeTokenGeneratorStub = (): TokenGenerator => ({
  generate: jest.fn(async (): Promise<Either<DomainError, string>> => right('valid_token'))
})

type SutTypes = {
  sut: AuthenticateUserUseCase
  hashComparer: HashComparer
  userRepository: UserRepository
  tokenGenerator: TokenGenerator
  errorFake: DomainError
  authenticateUserDataFake: AuthenticateUserData
}

const makeSut = (): SutTypes => {
  const fakes = {
    authenticateUserDataFake: makeAuthenticateUserDataFake(),
    errorFake: makeErrorFake()
  }
  const injection = {
    hashComparer: makeHashComparerStub(),
    userRepository: makeUserRepositoryStub(),
    tokenGenerator: makeTokenGeneratorStub()
  }
  const sut = new AuthenticateUserUseCase(injection)

  return { sut, ...injection, ...fakes }
}

describe('AuthenticateUserUseCase', () => {
  describe('success', () => {
    it('calls HashComparer with correct params', async () => {
      const { sut, hashComparer, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(hashComparer.compare).toHaveBeenCalledWith('password', 'hashed_password')
    })

    it('calls UserRepository.readByEmail with correct param', async () => {
      const { sut, userRepository, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(userRepository.readByEmail).toHaveBeenCalledWith('any@mail.com')
    })

    it('calls TokenGenerator with correct param', async () => {
      const { sut, tokenGenerator, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(tokenGenerator.generate).toHaveBeenCalledWith({ payload: { id: 'any_id' }, type: 'access' })
    })

    it('calls UserRepository.update with correct params', async () => {
      const { sut, userRepository, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(userRepository.update).toHaveBeenCalledWith({
        props: {
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
        }
      })
    })

    it('returns a message and the accessToken', async () => {
      const { sut, authenticateUserDataFake } = makeSut()

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value).toEqual({
        message: 'user authenticated successfully',
        accessToken: 'valid_token'
      })
    })
  })

  describe('failure', () => {
    it('returns an Error when UserRepository.readByEmail fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      jest.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(authenticateUserDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when HashComparer fails', async () => {
      const { sut, hashComparer, errorFake, authenticateUserDataFake } = makeSut()
      jest.spyOn(hashComparer, 'compare').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(authenticateUserDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when UserRepository.update fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(authenticateUserDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })
  })
})
