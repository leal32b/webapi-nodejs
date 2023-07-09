import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type AppRequest } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server.error'

import { type CreateGroupUseCase, type CreateGroupData, type CreateGroupResultDTO } from '@/identity/1.application/use-cases/create-group.use-case'
import { CreateGroupController } from '@/identity/2.presentation/controllers/create-group.controller'

import { makeErrorFake } from '~/common/_doubles/fakes/error.fake'

const makeRequestFake = (): AppRequest<CreateGroupData> => ({
  payload: {
    name: 'any_name'
  }
})

const makeCreateGroupUseCaseStub = (): CreateGroupUseCase => ({
  execute: vi.fn(async (): Promise<Either<DomainError[], CreateGroupResultDTO>> => right({
    message: 'any message',
    name: 'any_name'
  }))
} as any)

type SutTypes = {
  errorFake: DomainError
  requestFake: AppRequest<CreateGroupData>
  serverErrorFake: ServerError
  createGroupUseCase: CreateGroupUseCase
  sut: CreateGroupController
}

const makeSut = (): SutTypes => {
  const doubles = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake(),
    serverErrorFake: ServerError.create('server_error')
  }
  const props = {
    createGroupUseCase: makeCreateGroupUseCaseStub()
  }
  const sut = CreateGroupController.create(props)

  return {
    ...doubles,
    ...props,
    sut
  }
}

describe('CreateGroupController', () => {
  describe('success', () => {
    it('calls CreateGroupUseCase with correct params', async () => {
      const { sut, createGroupUseCase, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(createGroupUseCase.execute).toHaveBeenCalledWith({ name: 'any_name' })
    })

    it('returns 200 with email and message when when handle succeeds', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: {
          message: 'any message',
          name: 'any_name'
        },
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('returns 400 with error when CreateGroupUseCase returns a clientError', async () => {
      const { sut, createGroupUseCase, errorFake, requestFake } = makeSut()
      vi.spyOn(createGroupUseCase, 'execute').mockResolvedValueOnce(left([errorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'any_message' } },
        statusCode: 400
      })
    })

    it('returns 500 with error when CreateGroupUseCase returns a serverError', async () => {
      const { sut, createGroupUseCase, serverErrorFake, requestFake } = makeSut()
      vi.spyOn(createGroupUseCase, 'execute').mockResolvedValueOnce(left([serverErrorFake]))

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        payload: { error: { message: 'internal server error' } },
        statusCode: 500
      })
    })
  })
})
