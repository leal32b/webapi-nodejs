import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type AuthenticateUserData, type AuthenticateUserResultDTO, type AuthenticateUserUseCase } from '@/user/1.application/use-cases/authenticate-user-use-case'
import { SignInController } from '@/user/2.presentation/controllers/sign-in-controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeRequestFake = (): AppRequest<AuthenticateUserData> => ({
  payload: {
    email: 'any@email.com',
    password: 'any_password'
  }
})

const makeAuthenticateUserUseCaseStub = (): AuthenticateUserUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], AuthenticateUserResultDTO>> => right({
    accessToken: 'access_token',
    message: 'user authenticated successfully'
  }))
} as any)

type SutTypes = {
  sut: SignInController
  authenticateUserUseCase: AuthenticateUserUseCase
  errorFake: DomainError
  serverErrorFake: ServerError
  requestFake: AppRequest<AuthenticateUserData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    authenticateUserUseCase: makeAuthenticateUserUseCaseStub()
  }
  const sut = SignInController.create(props)

  return { sut, ...props, ...doubles }
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

    it('returns 200 with accessToken and message when valid credentials are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: {
          accessToken: 'access_token',
          message: 'user authenticated successfully'
        },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 401 with error when invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 401
      })
    })

    it('returns 500 with error when AuthenticateUserUseCase returns a serverError', async () => {
      const { sut, authenticateUserUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
