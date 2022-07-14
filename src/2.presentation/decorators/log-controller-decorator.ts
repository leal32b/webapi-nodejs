import Controller from '@/2.presentation/base/controller'
import LogErrorRepository from '@/2.presentation/repositories/log-error-repository'
import { HttpRequest } from '@/2.presentation/types/http-request'
import { HttpResponse } from '@/2.presentation/types/http-response'

export default class LogControllerDecorator extends Controller {
  constructor (private readonly props: {
    controller: Controller
    logErrorRepository: LogErrorRepository
  }) { super() }

  async handle (httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    const { controller, logErrorRepository } = this.props

    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await logErrorRepository.log(httpResponse.body)
    }

    return httpResponse
  }
}
