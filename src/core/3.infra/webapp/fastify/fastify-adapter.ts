import fastify, { FastifyInstance, FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify'

import { Either, left, right } from '@/core/0.domain/utils/either'
import { Controller, AppRequest } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { WebApp, Router } from '@/core/3.infra/api/app/web-app'

export class FastifyAdapter implements WebApp {
  readonly app: FastifyInstance

  constructor () {
    this.app = fastify()
  }

  setRouter (router: Router): Either<ServerError, void> {
    try {
      const { path, routes } = router

      for (const route of routes) {
        this.app[route.type](`/api${path}${path}`, this.fastifyRoute(route.controller))
      }
    } catch (error) {
      console.log('setRouter', error)

      return left(new ServerError(error.message, error.stack))
    }
  }

  listen (port: number, callback = null): Either<ServerError, void> {
    try {
      this.app.listen({ port, host: '0.0.0.0' }, callback)
      return right(null)
    } catch (error) {
      console.log('listen', error)

      return left(new ServerError(error.message, error.stack))
    }
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
