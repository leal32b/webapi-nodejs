import { Controller } from '@/2.adapter/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/2.adapter/interfaces/http'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    return httpResponse
  }
}
