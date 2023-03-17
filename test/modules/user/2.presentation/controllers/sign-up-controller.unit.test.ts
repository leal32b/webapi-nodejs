import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type AppRequest } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { type CreateUserData, type CreateUserResultDTO, type CreateUserUseCase } from '@/user/1.application/use-cases/create-user-use-case'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'

import { makeErrorFake } from '~/core/fakes/error-fake'

const makeRequestFake = (): AppRequest<CreateUserData> => ({
  payload: {
    email: 'any@mail.com',
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
        name: 'any_name',
        password: 'any_password',
        passwordRetype: 'any_password'
      })
    })

    it('returns 200 when valid params are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(200)
    })

    it('returns an User when valid params are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        email: 'any@mail.com',
        message: 'user created successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 400 when CreateUserUseCase returns a clientError', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(400)
    })

    it('returns error in body when CreateUserUseCase returns a clientError', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'any_message'
        }
      })
    })

    it('returns 500 when CreateUserUseCase returns a serverError', async () => {
      const { sut, createUserUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(500)
    })

    it('returns error in body when CreateUserUseCase returns a serverError', async () => {
      const { sut, createUserUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'internal server error'
        }
      })
    })
  })
})
