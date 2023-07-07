import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server.error'

import { type ChangePasswordData, type ChangePasswordResultDTO, type ChangePasswordUseCase } from '@/identity/1.application/use-cases/change-password.use-case'
import { ChangePasswordController } from '@/identity/2.presentation/controllers/change-password.controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'

const makeRequestFake = (): AppRequest<ChangePasswordData> => ({
  payload: {
    id: 'any_id',
    password: 'any_password',
    passwordRetype: 'any_password'
  }
})

const makeChangePasswordUseCaseStub = (): ChangePasswordUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], ChangePasswordResultDTO>> => right({
    message: 'any_message'
  }))
} as any)

type SutTypes = {
  errorFake: DomainError
  requestFake: AppRequest<ChangePasswordData>
  serverErrorFake: ServerError
  changePasswordUseCase: ChangePasswordUseCase
  sut: ChangePasswordController
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    changePasswordUseCase: makeChangePasswordUseCaseStub() as any
  }
  const sut = ChangePasswordController.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
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

    it('returns 200 with message when valid credentials are provided', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { message: 'any_message' },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 401 with error when passwords do not match', async () => {
      const { sut, changePasswordUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(changePasswordUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 401
      })
    })

    it('returns 500 with error when ChangePasswordUseCase returns a serverError', async () => {
      const { sut, changePasswordUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(changePasswordUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
