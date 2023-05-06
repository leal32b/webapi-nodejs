import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type CreateUserData, type CreateUserResultDTO, type CreateUserUseCase } from '@/user/1.application/use-cases/create-user-use-case'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeRequestFake = (): AppRequest<CreateUserData> => ({
  payload: {
    email: 'any@mail.com',
    locale: 'en',
    name: 'any_name',
    password: 'any_password',
    passwordRetype: 'any_password'
  }
})

const makeCreateUserUseCaseStub = (): CreateUserUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], CreateUserResultDTO>> => right({
    email: 'any@mail.com',
    message: 'user created successfully'
  }))
} as any)

type SutTypes = {
  sut: SignUpController
  createUserUseCase: CreateUserUseCase
  errorFake: DomainError
  serverErrorFake: ServerError
  requestFake: AppRequest<CreateUserData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    createUserUseCase: makeCreateUserUseCaseStub()
  }
  const sut = SignUpController.create(props)

  return { sut, ...props, ...doubles }
}

describe('SignUpController', () => {
  describe('success', () => {
    it('calls CreateUserUseCase with correct params', async () => {
      const { sut, createUserUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(createUserUseCase.execute).toHaveBeenCalledWith({
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
          message: 'user created successfully'
        },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 400 with error when CreateUserUseCase returns a clientError', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 400
      })
    })

    it('returns 500 with error when CreateUserUseCase returns a serverError', async () => {
      const { sut, createUserUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
