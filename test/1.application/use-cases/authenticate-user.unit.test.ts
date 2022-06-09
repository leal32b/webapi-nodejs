import User from '@/0.domain/entities/user'
import { Either, left, right } from '@/0.domain/utils/either'
import HashComparer from '@/1.application/interfaces/hash-comparer'
import ReadUserByEmailRepository from '@/1.application/interfaces/read-user-by-email-repository'
import TokenGenerator from '@/1.application/interfaces/token-generator'
import UpdateUserAccessTokenRepository from '@/1.application/interfaces/update-user-access-token-repository'
import { AuthenticationData } from '@/1.application/types/authentication-data'
import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user'

const makeAuthenticationDataFake = (): AuthenticationData => ({
  email: 'any@mail.com',
  password: 'password'
})

const makeHashComparerStub = (): HashComparer => ({
  compare: jest.fn(async (): Promise<boolean> => true)
})

const makeReadUserByEmailRepositoryStub = (): ReadUserByEmailRepository => ({
  read: jest.fn(async (): Promise<Either<Error, User>> => {
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
  update: jest.fn(async (): Promise<Either<Error, null>> => right(null))
})

type SutTypes = {
  sut: AuthenticateUserUseCase
  hashComparer: HashComparer
  readUserByEmailRepository: ReadUserByEmailRepository
  tokenGenerator: TokenGenerator
  updateUserAccessTokenRepository: UpdateUserAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const injection = {
    hashComparer: makeHashComparerStub(),
    readUserByEmailRepository: makeReadUserByEmailRepositoryStub(),
    tokenGenerator: makeTokenGeneratorStub(),
    updateUserAccessTokenRepository: makeUpdateUserAccessTokenRepositoryStub()
  }
  const sut = new AuthenticateUserUseCase(injection)

  return { sut, ...injection }
}

describe('AuthenticateUserUseCase', () => {
  describe('success', () => {
    it('calls HashComparer with correct values', async () => {
      const { sut, hashComparer } = makeSut()

      await sut.execute(makeAuthenticationDataFake())

      expect(hashComparer.compare).toHaveBeenCalledWith('password', 'hashed_password')
    })

    it('calls ReadUserByEmailRepository with correct param', async () => {
      const { sut, readUserByEmailRepository } = makeSut()

      await sut.execute(makeAuthenticationDataFake())

      expect(readUserByEmailRepository.read).toHaveBeenCalledWith(makeAuthenticationDataFake().email)
    })

    it('calls TokenGenerator with correct id', async () => {
      const { sut, tokenGenerator } = makeSut()

      await sut.execute(makeAuthenticationDataFake())

      expect(tokenGenerator.generate).toHaveBeenCalledWith('any_id')
    })

    it('calls UpdateUserAccessTokenRepository with correct values', async () => {
      const { sut, updateUserAccessTokenRepository } = makeSut()
      const updateSpy = jest.spyOn(updateUserAccessTokenRepository, 'update')

      await sut.execute(makeAuthenticationDataFake())

      expect(updateSpy).toHaveBeenCalledWith('any_id', 'valid_token')
    })

    it('returns an accessToken', async () => {
      const { sut } = makeSut()

      const accessToken = await sut.execute(makeAuthenticationDataFake())

      expect(accessToken.value).toBe('valid_token')
    })
  })

  describe('failure', () => {
    it('returns an Error if ReadUserByEmailRepository fails', async () => {
      const { sut, readUserByEmailRepository } = makeSut()
      jest.spyOn(readUserByEmailRepository, 'read').mockResolvedValueOnce(left(new Error()))

      const promise = sut.execute(makeAuthenticationDataFake())

      await expect(promise).resolves.toHaveProperty('value', new Error())
    })

    it('returns an Error if HashComparer fails', async () => {
      const { sut, hashComparer } = makeSut()
      jest.spyOn(hashComparer, 'compare').mockResolvedValueOnce(false)

      const promise = sut.execute(makeAuthenticationDataFake())

      await expect(promise).resolves.toHaveProperty('value', new Error())
    })

    it('returns an Error if UpdateUserAccessTokenRepository fails', async () => {
      const { sut, updateUserAccessTokenRepository } = makeSut()
      jest.spyOn(updateUserAccessTokenRepository, 'update').mockResolvedValueOnce(left(new Error()))

      const promise = sut.execute(makeAuthenticationDataFake())

      await expect(promise).resolves.toHaveProperty('value', new Error())
    })
  })
})
