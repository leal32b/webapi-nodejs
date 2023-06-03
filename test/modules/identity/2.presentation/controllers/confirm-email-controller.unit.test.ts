import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, right, left } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type ConfirmEmailData, type ConfirmEmailResultDTO, type ConfirmEmailUseCase } from '@/identity/1.application/use-cases/confirm-email-use-case'
import { ConfirmEmailController } from '@/identity/2.presentation/controllers/confirm-email-controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error-fake'

const makeRequestFake = (): AppRequest<ConfirmEmailData> => ({
  payload: {
    token: 'any_token'
  }
})

const makeConfirmEmailUseCaseStub = (): ConfirmEmailUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], ConfirmEmailResultDTO>> => right({
    message: 'email confirmed successfully'
  }))
} as any)

type SutTypes = {
  sut: ConfirmEmailController
  confirmEmailUseCase: ConfirmEmailUseCase
  errorFake: DomainError
  serverErrorFake: ServerError
  requestFake: AppRequest<ConfirmEmailData>
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    confirmEmailUseCase: makeConfirmEmailUseCaseStub()
  }

  const sut = ConfirmEmailController.create(props)

  return { sut, ...props, ...doubles }
}

describe('ConfirmEmailController', () => {
  describe('success', () => {
    it('calls ConfirmEmailUseCase with correct params', async () => {
      const { sut, confirmEmailUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(confirmEmailUseCase.execute).toHaveBeenCalledWith({
        token: 'any_token'
      })
    })

    it('returns 200 with message when handle succeeds', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: {
          message: 'email confirmed successfully'
        },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 400 with error when ConfirmEmailUseCase returns a clientError', async () => {
      const { sut, confirmEmailUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(confirmEmailUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 400
      })
    })

    it('returns 500 with error when ConfirmEmailUseCase returns a serverError', async () => {
      const { sut, confirmEmailUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(confirmEmailUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
