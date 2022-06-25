import DomainError from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user'
import SignInController from '@/2.presentation/controllers/sign-in'
import ServerError from '@/2.presentation/errors/server'
import { HttpRequest } from '@/2.presentation/types/http-request'
import { SignInData } from '@/2.presentation/types/sign-in-data'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeRequestFake = (): HttpRequest<SignInData> => ({
  body: {
    email: 'any@email.com',
    password: 'any_password'
  }
})

const makeAuthenticateUserUseCaseStub = (): AuthenticateUserUseCase => ({
  execute: jest.fn(async (): Promise<Either<DomainError[], string>> => {
    return right('access_token')
  })
} as any)

type SutTypes = {
  sut: SignInController
  authenticateUserUseCase: AuthenticateUserUseCase
  errorFake: DomainError
  requestFake: HttpRequest<SignInData>
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake()
  }
  const injection = {
    authenticateUserUseCase: makeAuthenticateUserUseCaseStub() as any
  }
  const sut = new SignInController(injection)

  return { sut, ...injection, ...fakes }
}

describe('SignInController', () => {
  describe('success', () => {
    it('calls AuthenticateUserUseCase with correct params', async () => {
      const { sut, authenticateUserUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(authenticateUserUseCase.execute).toHaveBeenCalledWith({
        email: 'any@email.com',
        password: 'any_password'
      })
    })

    it('returns 200 (Ok) when valid credentials are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result.body).toEqual({ accessToken: 'access_token' })
    })
  })

  describe('failure', () => {
    it('returns 401 (Unauthorized) when invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toEqual(401)
    })

    it('returns an error in body when invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.body[0]).toBeInstanceOf(DomainError)
    })

    it('returns 500 (Internal Server Error) when anything throws', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockRejectedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(500)
    })

    it('returns ServerError in body when anything throws', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockRejectedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)
      console.log('result >>>', result)

      expect(result.body).toBeInstanceOf(ServerError)
    })
  })
})
