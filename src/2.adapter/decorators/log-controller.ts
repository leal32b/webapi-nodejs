import Controller from '@/2.adapter/interfaces/controller'
import LogErrorRepository from '@/2.adapter/interfaces/log-error-repository'
import { HttpRequest, HttpResponse } from '@/2.adapter/types/http-types'

export default class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}
