import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type SignUpData, type SignUpResultDTO, type SignUpUseCase } from '@/identity/1.application/use-cases/sign-up-use-case'
import { SignUpController } from '@/identity/2.presentation/controllers/sign-up-controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeRequestFake = (): AppRequest<SignUpData> => ({
  payload: {
    email: 'any@mail.com',
    locale: 'en',
    name: 'any_name',
    password: 'any_password',
    passwordRetype: 'any_password'
  }
})

const makeSignUpUseCaseStub = (): SignUpUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], SignUpResultDTO>> => right({
    email: 'any@mail.com',
    message: 'any message'
  }))
} as any)

type SutTypes = {
  errorFake: DomainError
  requestFake: AppRequest<SignUpData>
  serverErrorFake: ServerError
  signUpUseCase: SignUpUseCase
  sut: SignUpController
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    signUpUseCase: makeSignUpUseCaseStub()
  }
  const sut = SignUpController.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('SignUpController', () => {
  describe('success', () => {
    it('calls SignUpUseCase with correct params', async () => {
      const { sut, signUpUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(signUpUseCase.execute).toHaveBeenCalledWith({
        email: 'any@mail.com',
        locale: 'en',
        name: 'any_name',
        password: 'any_password',
        passwordRetype: 'any_password'
      })
    })

    it('returns 200 with email and message when when handle succeeds', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: {
          email: 'any@mail.com',
          message: 'any message'
        },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 400 with error when SignUpUseCase returns a clientError', async () => {
      const { sut, signUpUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(signUpUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 400
      })
    })

    it('returns 500 with error when SignUpUseCase returns a serverError', async () => {
      const { sut, signUpUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(signUpUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
