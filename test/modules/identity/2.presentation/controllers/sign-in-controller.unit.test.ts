import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type SignInUserData, type SignInUserResultDTO, type SignInUserUseCase } from '@/identity/1.application/use-cases/sign-in-user-use-case'
import { SignInController } from '@/identity/2.presentation/controllers/sign-in-controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeRequestFake = (): AppRequest<SignInUserData> => ({
  payload: {
    email: 'any@email.com',
    password: 'any_password'
  }
})

const makeSignInUserUseCaseStub = (): SignInUserUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], SignInUserResultDTO>> => right({
    accessToken: 'access_token',
    message: 'user signed in successfully'
  }))
} as any)

type SutTypes = {
  sut: SignInController
  signInUserUseCase: SignInUserUseCase
  errorFake: DomainError
  serverErrorFake: ServerError
  requestFake: AppRequest<SignInUserData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    signInUserUseCase: makeSignInUserUseCaseStub()
  }
  const sut = SignInController.create(props)

  return { sut, ...props, ...doubles }
}

describe('SignInController', () => {
  describe('success', () => {
    it('calls SignInUserUseCase with correct params', async () => {
      const { sut, signInUserUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(signInUserUseCase.execute).toHaveBeenCalledWith({
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
          message: 'user signed in successfully'
        },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 401 with error when invalid credentials are provided', async () => {
      const { sut, signInUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(signInUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 401
      })
    })

    it('returns 500 with error when SignInUserUseCase returns a serverError', async () => {
      const { sut, signInUserUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(signInUserUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
