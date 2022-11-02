import express, { Express, json, NextFunction, Request, RequestHandler, Response } from 'express'

import { Either, left, right } from '@/core/0.domain/utils/either'
import { Controller, AppRequest } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { WebApp, Router, Route, Header } from '@/core/3.infra/api/app/web-app'

export class ExpressAdapter implements WebApp {
  private readonly _app: Express

  constructor () {
    this._app = express()
    this._app.use(json())
  }

  listen (port: number, callback = null): Either<ServerError, void> {
    try {
      this.app.listen(port, callback)

      return right()
    } catch (error) {
      console.log('listen', error)

      return left(new ServerError(error.message, error.stack))
    }
  }

  setApiSpecification (path: string, middlewares: any[]): Either<ServerError, void> {
    try {
      this.app.use(path, ...middlewares)

      return right()
    } catch (error) {
      console.log('setApiSpecification', error)

      return left(new ServerError(error.message, error.stack))
    }
  }

  setContentType (type: string): Either<ServerError, void> {
    try {
      this.app.use((req: Request, res: Response, next: NextFunction): void => {
        res.type(type)
        next()
      })

      return right()
    } catch (error) {
      console.log('setContentType', error)

      return left(new ServerError(error.message, error.stack))
    }
  }

  setHeaders (headers: Header[]): Either<ServerError, void> {
    try {
      this.app.use((req: Request, res: Response, next: NextFunction): void => {
        headers.forEach(({ field, value }) => {
          res.set(field, value)
        })
        next()
      })

      return right()
    } catch (error) {
      console.log('setHeaders', error)

      return left(new ServerError(error.message, error.stack))
    }
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
        console.log(`route ${route.type.toUpperCase()} ${path}${route.path}`)
      }

      return right()
    } catch (error) {
      console.log('setRouter', error)

      return left(new ServerError(error.message, error.stack))
    }
  }

  get app (): Express {
    return this._app
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
        auth,
        payload: request.body,
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
