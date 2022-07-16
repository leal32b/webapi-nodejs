import UserAggregate from '@/0.domain/aggregates/user-aggregate'
import DomainError from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import Encrypter, { TokenType } from '@/1.application/cryptography/encrypter'
import Hasher from '@/1.application/cryptography/hasher'
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

const makeUserRepositoryStub = (): UserRepository => ({
  create: jest.fn(async (): Promise<Either<DomainError[], void>> => {
    return right(null)
  }),
  readByEmail: jest.fn(async (): Promise<Either<DomainError[], UserAggregate>> => {
    return right(UserAggregate.create({
      email: 'any@mail.com',
      id: 'any_id',
      name: 'any_name',
      password: 'hashed_password',
      token: 'any_token'
    }).value as UserAggregate)
  }),
  update: jest.fn(async (): Promise<Either<DomainError[], void>> => {
    return right(null)
  })
})

const makeHasherStub = (): Hasher => ({
  hash: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('hashed_password')
  }),
  compare: jest.fn(async (): Promise<Either<DomainError, boolean>> => {
    return right(true)
  })
})

const makeEncrypterStub = (): Encrypter => ({
  encrypt: jest.fn(async (): Promise<Either<DomainError, string>> => {
    return right('token')
  }),
  decrypt: jest.fn(async (): Promise<Either<DomainError, any>> => {
    return right({
      type: TokenType.access,
      payload: {
        anyKey: 'any_value'
      }
    })
  })
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
  const fakes = {
    authenticateUserDataFake: makeAuthenticateUserDataFake(),
    errorFake: makeErrorFake()
  }
  const injection = {
    userRepository: makeUserRepositoryStub(),
    hasher: makeHasherStub(),
    encrypter: makeEncrypterStub()
  }
  const sut = new AuthenticateUserUseCase(injection)

  return { sut, ...injection, ...fakes }
}

describe('AuthenticateUserUseCase', () => {
  describe('success', () => {
    it('calls UserRepository.readByEmail with correct param', async () => {
      const { sut, userRepository, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(userRepository.readByEmail).toHaveBeenCalledWith('any@mail.com')
    })

    it('calls Hasher.compare with correct params', async () => {
      const { sut, hasher, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(hasher.compare).toHaveBeenCalledWith('password', 'hashed_password')
    })

    it('calls Encrypter.encrypt with correct param', async () => {
      const { sut, encrypter, authenticateUserDataFake } = makeSut()

      await sut.execute(authenticateUserDataFake)

      expect(encrypter.encrypt).toHaveBeenCalledWith({ payload: { id: 'any_id' }, type: 'access' })
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
        accessToken: 'token'
      })
    })
  })

  describe('failure', () => {
    it('returns an Error when UserRepository.readByEmail fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      jest.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left([errorFake]))

      const promise = sut.execute(authenticateUserDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when Hasher.compare fails', async () => {
      const { sut, hasher, errorFake, authenticateUserDataFake } = makeSut()
      jest.spyOn(hasher, 'compare').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(authenticateUserDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when Encrypter.encrypt fails', async () => {
      const { sut, encrypter, errorFake, authenticateUserDataFake } = makeSut()
      jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(authenticateUserDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when UserRepository.update fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(left([errorFake]))

      const promise = sut.execute(authenticateUserDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })
  })
})
