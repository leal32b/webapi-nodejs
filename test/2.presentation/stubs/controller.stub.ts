import Controller from '@/2.presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/2.presentation/types/http-types'

export const makeControllerStub = (): Controller => {
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