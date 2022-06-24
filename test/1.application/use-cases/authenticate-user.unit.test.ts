import DomainError from '@/0.domain/base/domain-error'
import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import HashComparer from '@/1.application/interfaces/hash-comparer'
import ReadUserByEmailRepository from '@/1.application/interfaces/read-user-by-email-repository'
import TokenGenerator from '@/1.application/interfaces/token-generator'
import UpdateUserAccessTokenRepository from '@/1.application/interfaces/update-user-access-token-repository'
import { AuthenticationData } from '@/1.application/types/authentication-data'
import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeAuthenticationDataFake = (): AuthenticationData => ({
  email: 'any@mail.com',
  password: 'password'
})

const makeHashComparerStub = (): HashComparer => ({
  compare: jest.fn(async (): Promise<Either<DomainError, true>> => right(true))
})

const makeReadUserByEmailRepositoryStub = (): ReadUserByEmailRepository => ({
  read: jest.fn(async (): Promise<Either<DomainError, User>> => {
    return right(User.create({
      email: 'any@mail.com',
      id: 'any_id',
      name: 'any_name',
      password: 'hashed_password'
    }).value as User)
  })
})

const makeTokenGeneratorStub = (): TokenGenerator => ({
  generate: jest.fn(async (): Promise<string> => 'valid_token')
})

const makeUpdateUserAccessTokenRepositoryStub = (): UpdateUserAccessTokenRepository => ({
  update: jest.fn(async (): Promise<Either<DomainError, true>> => right(null))
})

type SutTypes = {
  sut: AuthenticateUserUseCase
  hashComparer: HashComparer
  readUserByEmailRepository: ReadUserByEmailRepository
  tokenGenerator: TokenGenerator
  updateUserAccessTokenRepository: UpdateUserAccessTokenRepository
  errorFake: DomainError
  authenticationDataFake: AuthenticationData
}

const makeSut = (): SutTypes => {
  const fakes = {
    authenticationDataFake: makeAuthenticationDataFake(),
    errorFake: makeErrorFake()
  }
  const injection = {
    hashComparer: makeHashComparerStub(),
    readUserByEmailRepository: makeReadUserByEmailRepositoryStub(),
    tokenGenerator: makeTokenGeneratorStub(),
    updateUserAccessTokenRepository: makeUpdateUserAccessTokenRepositoryStub()
  }
  const sut = new AuthenticateUserUseCase(injection)

  return { sut, ...injection, ...fakes }
}

describe('AuthenticateUserUseCase', () => {
  describe('success', () => {
    it('calls HashComparer with correct params', async () => {
      const { sut, hashComparer, authenticationDataFake } = makeSut()

      await sut.execute(authenticationDataFake)

      expect(hashComparer.compare).toHaveBeenCalledWith('password', 'hashed_password')
    })

    it('calls ReadUserByEmailRepository with correct param', async () => {
      const { sut, readUserByEmailRepository, authenticationDataFake } = makeSut()

      await sut.execute(authenticationDataFake)

      expect(readUserByEmailRepository.read).toHaveBeenCalledWith(authenticationDataFake.email)
    })

    it('calls TokenGenerator with correct param', async () => {
      const { sut, tokenGenerator, authenticationDataFake } = makeSut()

      await sut.execute(authenticationDataFake)

      expect(tokenGenerator.generate).toHaveBeenCalledWith('any_id')
    })

    it('calls UpdateUserAccessTokenRepository with correct params', async () => {
      const { sut, updateUserAccessTokenRepository, authenticationDataFake } = makeSut()

      await sut.execute(authenticationDataFake)

      expect(updateUserAccessTokenRepository.update).toHaveBeenCalledWith('any_id', 'valid_token')
    })

    it('returns an accessToken', async () => {
      const { sut, authenticationDataFake } = makeSut()

      const accessToken = await sut.execute(authenticationDataFake)

      expect(accessToken.value).toBe('valid_token')
    })
  })

  describe('failure', () => {
    it('returns an Error when ReadUserByEmailRepository fails', async () => {
      const { sut, readUserByEmailRepository, errorFake, authenticationDataFake } = makeSut()
      jest.spyOn(readUserByEmailRepository, 'read').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(authenticationDataFake)

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when HashComparer fails', async () => {
      const { sut, hashComparer, errorFake } = makeSut()
      jest.spyOn(hashComparer, 'compare').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(makeAuthenticationDataFake())

      await expect(promise).resolves.toEqual(left([errorFake]))
    })

    it('returns an Error when UpdateUserAccessTokenRepository fails', async () => {
      const { sut, updateUserAccessTokenRepository, errorFake } = makeSut()
      jest.spyOn(updateUserAccessTokenRepository, 'update').mockResolvedValueOnce(left(errorFake))

      const promise = sut.execute(makeAuthenticationDataFake())

      await expect(promise).resolves.toEqual(left([errorFake]))
    })
  })
})
