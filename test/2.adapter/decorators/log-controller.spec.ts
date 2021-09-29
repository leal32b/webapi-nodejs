import { LogControllerDecorator } from '@/2.adapter/decorators/log-controller'
import { Controller } from '@/2.adapter/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/2.adapter/interfaces/http'

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
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
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
})
