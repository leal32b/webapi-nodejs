import { DomainError } from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import { AuthenticateUserUseCase, AuthenticateUserResultDTO } from '@/1.application/use-cases/authenticate-user-use-case'
import { AppRequest } from '@/2.presentation/base/controller'
import { SignInController, SignInData } from '@/2.presentation/controllers/sign-in-controller'
import { ServerError } from '@/2.presentation/errors/server-error'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeSystemErrorFake = (): Error => ({
  name: 'any_name',
  message: 'any_message',
  stack: 'any_stack'
})

const makeRequestFake = (): AppRequest<SignInData> => ({
  payload: {
    email: 'any@email.com',
    password: 'any_password'
  }
})

const makeAuthenticateUserUseCaseStub = (): AuthenticateUserUseCase => ({
  execute: jest.fn(async (): Promise<Either<DomainError[], AuthenticateUserResultDTO>> => {
    return right({
      accessToken: 'access_token',
      message: 'user authenticated successfully'
    })
  })
} as any)

type SutTypes = {
  sut: SignInController
  authenticateUserUseCase: AuthenticateUserUseCase
  errorFake: DomainError
  systemErrorFake: Error
  requestFake: AppRequest<SignInData>
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    systemErrorFake: makeSystemErrorFake(),
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

    it('returns "ok" when valid credentials are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(200)
    })

    it('returns a accessToken when valid credentials are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        accessToken: 'access_token',
        message: 'user authenticated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns "unauthorized" when invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(401)
    })

    it('returns errors in body when invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.payload[0]).toBeInstanceOf(DomainError)
    })

    it('returns "internal_server_error" when anything throws', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockRejectedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(500)
    })

    it('returns ServerError in body when anything throws', async () => {
      const { sut, authenticateUserUseCase, systemErrorFake, requestFake } = makeSut()
      jest.spyOn(authenticateUserUseCase, 'execute').mockRejectedValueOnce(systemErrorFake)

      const result = await sut.handle(requestFake)

      expect(result.payload).toBeInstanceOf(ServerError)
    })
  })
})
