import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { AppRequest } from '@/core/2.presentation/base/controller'
import { AuthenticateUserData, AuthenticateUserResultDTO, AuthenticateUserUseCase } from '@/user/1.application/use-cases/authenticate-user-use-case'
import { SignInController } from '@/user/2.presentation/controllers/sign-in-controller'

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeSystemErrorFake = (): Error => ({
  message: 'any_message',
  name: 'any_name',
  stack: 'any_stack'
})

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
  systemErrorFake: Error
  requestFake: AppRequest<AuthenticateUserData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    systemErrorFake: makeSystemErrorFake()
  }
  const params = {
    authenticateUserUseCase: makeAuthenticateUserUseCaseStub() as any
  }
  const sut = new SignInController(params)

  return { sut, ...params, ...doubles }
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

    it('returns 200 when valid credentials are provided', async () => {
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
    it('returns 401 when invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(401)
    })

    it('returns error in body when invalid credentials are provided', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'any_message'
        }
      })
    })

    it('returns 500 when anything throws', async () => {
      const { sut, authenticateUserUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(500)
    })

    it('returns ServerError in body when anything throws', async () => {
      const { sut, authenticateUserUseCase, systemErrorFake, requestFake } = makeSut()
      vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValueOnce(systemErrorFake)

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'internal server error'
        }
      })
    })
  })
})
