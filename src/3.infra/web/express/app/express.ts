import express, { Express } from 'express'

import { Route } from '@/2.presentation/types/route'
import WebApp from '@/3.infra/interfaces/web-app'
import { adaptExpressRoute } from '@/3.infra/web/express/adapters/express-route'
import setupMiddlewares from '@/3.infra/web/express/config/middlewares'

export default class ExpressApp implements WebApp {
  readonly app: Express

  constructor () {
    this.app = express()

    setupMiddlewares(this.app)
  }

  setRoute (route: Route): void {
    const { type, path, controller } = route

    this.app[type](path, adaptExpressRoute(controller))
  }

  listen (port: number, callback = null): void {
    this.app.listen(port, callback)
  }
}
