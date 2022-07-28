import express, { Express, Request, RequestHandler, Response } from 'express'

import Controller, { AppRequest } from '@/2.presentation/base/controller'
import WebApp, { Router } from '@/3.infra/api/app/web-app'
import setupExpressMiddlewares from '@/3.infra/webapp/express/config/setup-express-middlewares'

export default class ExpressAdapter implements WebApp {
  readonly app: Express

  constructor () {
    this.app = express()

    setupExpressMiddlewares(this.app)
  }

  setRouter (router: Router): void {
    const { path, routes } = router

    for (const route of routes) {
      this.app[route.type](`${path}${route.path}`, this.expressRoute(route.controller))
    }
  }

  listen (port: number, callback = null): void {
    this.app.listen(port, callback)
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
