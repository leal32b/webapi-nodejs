import { RouteHandlerMethod, FastifyRequest, FastifyReply } from 'fastify'

import Controller from '@/2.presentation/base/controller'
import { HttpRequest } from '@/2.presentation/types/http-request'

export const adaptFastifyRoute = (controller: Controller): RouteHandlerMethod => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const httpRequest: HttpRequest<any> = {
      body: request.body
    }

    const httpResponse = await controller.handle(httpRequest)
    reply.code(httpResponse.statusCode).send(httpResponse.body)
  }
}
