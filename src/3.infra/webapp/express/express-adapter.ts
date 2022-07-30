import express, { Express, Request, RequestHandler, Response } from 'express'

import { Either, left, right } from '@/0.domain/utils/either'
import Controller, { AppRequest } from '@/2.presentation/base/controller'
import ServerError from '@/2.presentation/errors/server-error'
import WebApp, { Router } from '@/3.infra/api/app/web-app'
import setupExpressMiddlewares from '@/3.infra/webapp/express/config/setup-express-middlewares'

export default class ExpressAdapter implements WebApp {
  readonly app: Express

  constructor () {
    this.app = express()

    setupExpressMiddlewares(this.app)
  }

  setRouter (router: Router): Either<ServerError, void> {
    try {
      const { path, routes } = router

      for (const route of routes) {
        this.app[route.type](`/api${path}${route.path}`, this.expressRoute(route.controller))
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

  private expressRoute (controller: Controller): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const httpRequest: AppRequest<any> = {
        payload: req.body
      }

      const appResponse = await controller.handle(httpRequest)
      const { statusCode, payload } = appResponse

      res.status(statusCode).json(payload)
    }
  }
}
