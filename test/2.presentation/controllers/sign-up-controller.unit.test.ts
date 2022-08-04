import { DomainError } from '@/0.domain/base/domain-error'
import { Either, left, right } from '@/0.domain/utils/either'
import { CreateUserUseCase, CreateUserResultDTO } from '@/1.application/use-cases/create-user-use-case'
import { AppRequest } from '@/2.presentation/base/controller'
import { SignUpController, SignUpData } from '@/2.presentation/controllers/sign-up-controller'
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

const makeRequestFake = (): AppRequest<SignUpData> => ({
  payload: {
    email: 'any@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordRetype: 'any_password'
  }
})

const makeCreateUserUseCaseStub = (): CreateUserUseCase => ({
  execute: jest.fn(async (): Promise<Either<DomainError[], CreateUserResultDTO>> => {
    return right({
      email: 'any@mail.com',
      message: 'user created successfully'
    })
  })
} as unknown as CreateUserUseCase)

type SutTypes = {
  sut: SignUpController
  createUserUseCase: CreateUserUseCase
  errorFake: DomainError
  systemErrorFake: Error
  requestFake: AppRequest<SignUpData>
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    systemErrorFake: makeSystemErrorFake(),
    requestFake: makeRequestFake()
  }
  const injection = {
    createUserUseCase: makeCreateUserUseCaseStub()
  }
  const sut = new SignUpController(injection)

  return { sut, ...injection, ...fakes }
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

    it('returns "ok" when valid params are provided', async () => {
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
    it('returns "bad_request" when CreateUserUseCase returns any error', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(400)
    })

    it('returns errors in body when CreateUserUseCase returns errors', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(createUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.payload[0]).toBeInstanceOf(DomainError)
    })

    it('returns "internal_server_error" when anything throws', async () => {
      const { sut, createUserUseCase, errorFake, requestFake } = makeSut()
      jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(500)
    })

    it('returns ServerError in body when anything throws', async () => {
      const { sut, createUserUseCase, systemErrorFake, requestFake } = makeSut()
      jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(systemErrorFake)

      const result = await sut.handle(requestFake)

      expect(result.payload).toBeInstanceOf(ServerError)
    })
  })
})
