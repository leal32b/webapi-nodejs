import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type SignInData, type SignInResultDTO, type SignInUseCase } from '@/identity/1.application/use-cases/sign-in-use-case'
import { SignInController } from '@/identity/2.presentation/controllers/sign-in-controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeRequestFake = (): AppRequest<SignInData> => ({
  payload: {
    email: 'any@email.com',
    password: 'any_password'
  }
})

const makeSignInUseCaseStub = (): SignInUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], SignInResultDTO>> => right({
    accessToken: 'access_token',
    message: 'user signed in successfully'
  }))
} as any)

type SutTypes = {
  errorFake: DomainError
  requestFake: AppRequest<SignInData>
  serverErrorFake: ServerError
  signInUseCase: SignInUseCase
  sut: SignInController
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    signInUseCase: makeSignInUseCaseStub()
  }
  const sut = SignInController.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('SignInController', () => {
  describe('success', () => {
    it('calls SignInUseCase with correct params', async () => {
      const { sut, signInUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(signInUseCase.execute).toHaveBeenCalledWith({
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
      const { sut, signInUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(signInUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 401
      })
    })

    it('returns 500 with error when SignInUseCase returns a serverError', async () => {
      const { sut, signInUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(signInUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
