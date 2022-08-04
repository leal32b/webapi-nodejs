import fastify, { FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify'

import { Controller, AppRequest } from '@/2.presentation/base/controller'
import { WebApp, Router } from '@/3.infra/api/app/web-app'

export class FastifyAdapter implements WebApp {
  private readonly app: FastifyInstance

  constructor () {
    this.app = fastify()
  }

  setRouter (router: Router): void {
    const { path, routes } = router

    for (const route of routes) {
      this.app[route.type](`${path}${path}`, this.fastifyRoute(route.controller))
    }
  }

  listen (port: number, callback = null): void {
    this.app.listen({ port, host: '0.0.0.0' }, callback)
  }

  private fastifyRoute (controller: Controller): RouteHandlerMethod {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const httpRequest: AppRequest<any> = {
        payload: request.body
      }

      const appResponse = await controller.handle(httpRequest)
      const { statusCode, payload } = appResponse

      reply.code(statusCode).send(payload)
    }
  }
}
