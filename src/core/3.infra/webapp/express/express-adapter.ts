import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express'

import { Either, left, right } from '@/core/0.domain/utils/either'
import { Controller, AppRequest } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { WebApp, Router, Route } from '@/core/3.infra/api/app/web-app'
import { setupExpressMiddlewares } from '@/core/3.infra/webapp/express/config/setup-express-middlewares'

export class ExpressAdapter implements WebApp {
  readonly app: Express

  constructor () {
    this.app = express()

    setupExpressMiddlewares(this.app)
  }

  setRouter (router: Router): Either<ServerError, void> {
    try {
      const { path, routes, middlewares } = router

      for (const route of routes) {
        this.app[route.type](
          '/api' + path + route.path,
          middlewares.map(middleware => this.expressMiddleware(route, middleware)),
          this.expressController(route.controller)
        )
      }

      return right(null)
    } catch (error) {
      console.log('setRouter', error)

      return left(new ServerError(error.message, error.stack))
    }
  }

  listen (port: number, callback = null): Either<ServerError, void> {
    try {
      this.app.listen(port, callback)

      return right(null)
    } catch (error) {
      console.log('listen', error)

      return left(new ServerError(error.message, error.stack))
    }
  }

  private expressController (controller: Controller): RequestHandler {
    return async (request: Request, response: Response): Promise<void> => {
      const httpRequest: AppRequest<any> = {
        payload: request.body
      }
      const appResponse = await controller.handle(httpRequest)
      const { statusCode, payload } = appResponse

      response.status(statusCode).json(payload)
    }
  }

  private expressMiddleware (route: Route, middleware: Middleware): RequestHandler {
    const { auth, schema } = route

    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const httpRequest = {
        accessToken: request.headers.authorization,
        payload: request.body,
        auth,
        schema
      }
      const appResponse = await middleware.handle(httpRequest)
      const { statusCode, payload } = appResponse

      if (statusCode === 200) {
        Object.assign(request, payload)
        next()
      } else {
        response.status(statusCode).json(payload)
      }
    }
  }
}
