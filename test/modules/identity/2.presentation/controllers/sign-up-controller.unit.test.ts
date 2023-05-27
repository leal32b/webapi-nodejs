import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type SignUpUserData, type SignUpUserResultDTO, type SignUpUserUseCase } from '@/identity/1.application/use-cases/sign-up-user-use-case'
import { SignUpController } from '@/identity/2.presentation/controllers/sign-up-controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeRequestFake = (): AppRequest<SignUpUserData> => ({
  payload: {
    email: 'any@mail.com',
    locale: 'en',
    name: 'any_name',
    password: 'any_password',
    passwordRetype: 'any_password'
  }
})

const makeSignUpUserUseCaseStub = (): SignUpUserUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], SignUpUserResultDTO>> => right({
    email: 'any@mail.com',
    message: 'user signed up successfully'
  }))
} as any)

type SutTypes = {
  sut: SignUpController
  signUpUserUseCase: SignUpUserUseCase
  errorFake: DomainError
  serverErrorFake: ServerError
  requestFake: AppRequest<SignUpUserData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    signUpUserUseCase: makeSignUpUserUseCaseStub()
  }
  const sut = SignUpController.create(props)

  return { sut, ...props, ...doubles }
}

describe('SignUpController', () => {
  describe('success', () => {
    it('calls SignUpUserUseCase with correct params', async () => {
      const { sut, signUpUserUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(signUpUserUseCase.execute).toHaveBeenCalledWith({
        email: 'any@mail.com',
        locale: 'en',
        name: 'any_name',
        password: 'any_password',
        passwordRetype: 'any_password'
      })
    })

    it('returns 200 with email and message when valid params are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: {
          email: 'any@mail.com',
          message: 'user signed up successfully'
        },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 400 with error when SignUpUserUseCase returns a clientError', async () => {
      const { sut, signUpUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(signUpUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 400
      })
    })

    it('returns 500 with error when SignUpUserUseCase returns a serverError', async () => {
      const { sut, signUpUserUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(signUpUserUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
