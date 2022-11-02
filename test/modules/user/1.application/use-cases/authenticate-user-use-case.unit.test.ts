import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { Encrypter, TokenType } from '@/core/1.application/cryptography/encrypter'
import { Hasher } from '@/core/1.application/cryptography/hasher'
import { NotFoundError } from '@/core/1.application/errors/not-found-error'
import { UserAggregate } from '@/user/0.domain/aggregates/user-aggregate'
import { Token } from '@/user/0.domain/value-objects/token'
import { UserRepository } from '@/user/1.application/repositories/user-repository'
import { AuthenticateUserData, AuthenticateUserUseCase } from '@/user/1.application/use-cases/authenticate-user-use-case'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeUserAggregateFake = (): UserAggregate => UserAggregate.create({
  email: 'any@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password',
  token: 'any_token'
}).value as UserAggregate

const makeAuthenticateUserDataFake = (): AuthenticateUserData => ({
  email: 'any@mail.com',
  password: 'any_password'
})

const makeUserRepositoryStub = (): UserRepository => ({
  create: vi.fn(async (): Promise<Either<DomainError[], void>> => right()),
  readByEmail: vi.fn(async (): Promise<Either<DomainError[], UserAggregate>> => right(makeUserAggregateFake())),
  readById: vi.fn(async (): Promise<Either<DomainError[], UserAggregate>> => right()),
  update: vi.fn(async (): Promise<Either<DomainError[], void>> => right())
})

const makeHasherStub = (): Hasher => ({
  compare: vi.fn(async (): Promise<Either<DomainError, boolean>> => right(true)),
  hash: vi.fn(async (): Promise<Either<DomainError, string>> => right('hashed_password'))
})

const makeEncrypterStub = (): Encrypter => ({
  decrypt: vi.fn(async (): Promise<Either<DomainError, any>> => right({
    payload: {
      auth: ['any_auth'],
      id: 'any_id'
    },
    type: TokenType.access
  })),
  encrypt: vi.fn(async (): Promise<Either<DomainError, string>> => right('token'))
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
  const params = {
    encrypter: makeEncrypterStub(),
    hasher: makeHasherStub(),
    userRepository: makeUserRepositoryStub()
  }
  const sut = new AuthenticateUserUseCase(params)

  return { sut, ...params, ...doubles }
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

      expect(hasher.compare).toHaveBeenCalledWith('hashed_password', 'any_password')
    })

    it('calls Encrypter.encrypt with correct param', async () => {
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

    it('returns a message and the accessToken', async () => {
      const { sut, authenticateUserDataFake } = makeSut()

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value).toEqual({
        accessToken: 'token',
        message: 'user authenticated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns an Error when UserRepository.readByEmail fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns NotFoundError when userRepository.readByEmail returns null', async () => {
      const { sut, userRepository, authenticateUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'readByEmail').mockResolvedValueOnce(right())

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value[0]).toBeInstanceOf(NotFoundError)
    })

    it('returns an Error when Hasher.compare fails', async () => {
      const { sut, hasher, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(hasher, 'compare').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when Encrypter.encrypt fails', async () => {
      const { sut, encrypter, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(left(errorFake))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when Token.create fails', async () => {
      const { sut, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(Token, 'create')
        .mockReturnValueOnce(right(Token.create('any_token').value as Token))
        .mockReturnValueOnce(left([errorFake]))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })

    it('returns an Error when UserRepository.update fails', async () => {
      const { sut, userRepository, errorFake, authenticateUserDataFake } = makeSut()
      vi.spyOn(userRepository, 'update').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.execute(authenticateUserDataFake)

      expect(result.value[0]).toBeInstanceOf(DomainError)
    })
  })
})
