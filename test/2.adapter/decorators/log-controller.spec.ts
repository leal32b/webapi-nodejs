import { LogControllerDecorator } from '@/2.adapter/decorators/log-controller'
import { serverError } from '@/2.adapter/helpers/http-response'
import { Controller } from '@/2.adapter/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/2.adapter/interfaces/http'
import { LogErrorRepository } from '@/2.adapter/interfaces/log-error-repository'

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name'
        }
      }

      return await Promise.resolve(httpResponse)
    }
  }

  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'ane_password',
        passwordConfirmation: 'ane_password'
      }
    }
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'ane_password',
        passwordConfirmation: 'ane_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      body: {
        name: 'any_name'
      },
      statusCode: 200
    })
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(serverError.internalServerError(fakeError))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'ane_password',
        passwordConfirmation: 'ane_password'
      }
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
