import { vi } from 'vitest'

import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { AppRequest } from '@/core/2.presentation/base/controller'
import { CreateUserData, CreateUserResultDTO, CreateUserUseCase } from '@/user/1.application/use-cases/create-user-use-case'
import { SignUpController } from '@/user/2.presentation/controllers/sign-up-controller'

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
} as unknown as CreateUserUseCase)

type SutTypes = {
  sut: SignUpController
  createUserUseCase: CreateUserUseCase
  errorFake: DomainError
  systemErrorFake: Error
  requestFake: AppRequest<CreateUserData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    systemErrorFake: makeSystemErrorFake(),
    requestFake: makeRequestFake()
  }
  const params = {
    createUserUseCase: makeCreateUserUseCaseStub()
  }
  const sut = new SignUpController(params)

  return { sut, ...params, ...doubles }
}

describe('SignUpController', () => {
  describe('success', () => {
    it('calls CreateUserUseCase with correct params', async () => {
      const { sut, createUserUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(createUserUseCase.execute).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any@mail.com',
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
    it('returns 400 when CreateUserUseCase returns any error', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(400)
    })

    it('returns error in body when CreateUserUseCase returns errors', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'any_message'
        }
      })
    })

    it('returns 500 when anything throws', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(500)
    })

    it('returns ServerError in body when anything throws', async () => {
      const { sut, createUserUseCase, systemErrorFake, requestFake } = makeSut()
      vi.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(systemErrorFake)

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'internal server error'
        }
      })
    })
  })
})
