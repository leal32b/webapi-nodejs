import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { AppRequest } from '@/core/2.presentation/base/controller'
import { ChangePasswordData, ChangePasswordResultDTO, ChangePasswordUseCase } from '@/user/1.application/use-cases/change-password-use-case'
import { ChangePasswordController } from '@/user/2.presentation/controllers/change-password-controller'

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

const makeRequestFake = (): AppRequest<ChangePasswordData> => ({
  payload: {
    id: 'any_id',
    password: 'any_password',
    passwordRetype: 'any_password'
  }
})

const makeChangePasswordUseCaseStub = (): ChangePasswordUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], ChangePasswordResultDTO>> => right({
    message: 'password updated successfully'
  }))
} as any)

type SutTypes = {
  sut: ChangePasswordController
  changePasswordUseCase: ChangePasswordUseCase
  errorFake: DomainError
  systemErrorFake: Error
  requestFake: AppRequest<ChangePasswordData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    systemErrorFake: makeSystemErrorFake(),
    requestFake: makeRequestFake()
  }
  const params = {
    changePasswordUseCase: makeChangePasswordUseCaseStub() as any
  }
  const sut = new ChangePasswordController(params)

  return { sut, ...params, ...doubles }
}

describe('ChangePasswordController', () => {
  describe('success', () => {
    it('calls ChangePasswordUseCase with correct params', async () => {
      const { sut, changePasswordUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(changePasswordUseCase.execute).toHaveBeenCalledWith({
        id: 'any_id',
        password: 'any_password',
        passwordRetype: 'any_password'
      })
    })

    it('returns 200 when valid credentials are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(200)
    })

    it('returns correct message when valid credentials are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        message: 'password updated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 400 when passwords do not match', async () => {
      const { sut, changePasswordUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(changePasswordUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(400)
    })

    it('returns error in body when invalid params are provided', async () => {
      const { sut, changePasswordUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(changePasswordUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'any_message'
        }
      })
    })

    it('returns 500 when anything throws', async () => {
      const { sut, changePasswordUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(changePasswordUseCase, 'execute').mockRejectedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result.statusCode).toBe(500)
    })

    it('returns ServerError in body when anything throws', async () => {
      const { sut, changePasswordUseCase, systemErrorFake, requestFake } = makeSut()
      vi.spyOn(changePasswordUseCase, 'execute').mockRejectedValueOnce(systemErrorFake)

      const result = await sut.handle(requestFake)

      expect(result.payload).toEqual({
        error: {
          message: 'internal server error'
        }
      })
    })
  })
})
