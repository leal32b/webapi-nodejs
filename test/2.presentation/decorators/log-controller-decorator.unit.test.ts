import DomainError from '@/0.domain/base/domain-error'
import Controller from '@/2.presentation/base/controller'
import LogControllerDecorator from '@/2.presentation/decorators/log-controller-decorator'
import LogErrorRepository from '@/2.presentation/repositories/log-error-repository'
import { HttpRequest } from '@/2.presentation/types/http-request'
import { HttpResponse } from '@/2.presentation/types/http-response'

type Test = {
  field: any
}

const makeErrorFake = (): DomainError => {
  class ErrorFake extends DomainError {
    constructor () {
      super({ message: 'any_message' })
    }
  }

  return new ErrorFake()
}

const makeRequestFake = (): HttpRequest<Test> => ({
  body: { field: 'any_value' }
})

const makeControllerStub = (): Controller => ({
  handle: jest.fn(async (): Promise<HttpResponse> => {
    return await Promise.resolve({
      statusCode: 200,
      body: {}
    })
  })
} as any)

const makeLogErrorRepositoryStub = (): LogErrorRepository => ({
  log: jest.fn(async (): Promise<void> => {
    return await Promise.resolve()
  })
} as any)

type SutTypes = {
  sut: LogControllerDecorator
  controller: Controller
  logErrorRepository: LogErrorRepository
  errorFake: DomainError
  requestFake: HttpRequest<Test>
}

const makeSut = (): SutTypes => {
  const fakes = {
    errorFake: makeErrorFake(),
    requestFake: makeRequestFake()
  }
  const injection = {
    controller: makeControllerStub(),
    logErrorRepository: makeLogErrorRepositoryStub()
  }
  const sut = new LogControllerDecorator(injection)

  return { sut, ...injection, ...fakes }
}

describe('LogControllerDecorator', () => {
  describe('success', () => {
    it('calls controller.handle with correct params', async () => {
      const { sut, controller, requestFake } = makeSut()

      await sut.handle(requestFake)

      expect(controller.handle).toHaveBeenCalledWith({ body: { field: 'any_value' } })
    })

    it('returns the result of the controller', async () => {
      const { sut, requestFake } = makeSut()

      const result = await sut.handle(requestFake)

      expect(result).toEqual({
        body: {},
        statusCode: 200
      })
    })
  })

  describe('failure', () => {
    it('calls LogErrorRepository with correct params when controller returns an error', async () => {
      const { sut, controller, errorFake, logErrorRepository, requestFake } = makeSut()
      jest.spyOn(controller, 'handle').mockResolvedValueOnce({ statusCode: 500, body: { errorFake } })

      await sut.handle(requestFake)

      expect(logErrorRepository.log).toHaveBeenCalledWith({ errorFake })
    })
  })
})
