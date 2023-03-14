import express, {
  type Express, json, type NextFunction, type Request, type RequestHandler, type Response
} from 'express'

import { type Either, left, right } from '@/core/0.domain/utils/either'
import { type Controller, type AppRequest } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { type Middleware } from '@/core/2.presentation/middleware/middleware'
import { type WebApp, type Router, type Route, type Header } from '@/core/3.infra/api/app/web-app'

export class ExpressAdapter implements WebApp {
  private readonly _app: Express

  private constructor (private readonly port: number) {
    this._app = express()
    this._app.use(json())
    this._app.use(this.log)
  }

  public static create (port: number): ExpressAdapter {
    return new ExpressAdapter(port)
  }

  public listen (callback = null): Either<ServerError, void> {
    try {
      this.app.listen(this.port, callback)

      console.info(`server running: http://localhost:${this.port}`)

      return right()
    } catch (error) {
      console.error('listen', error)

      return left(ServerError.create(error.message, error.stack))
    }
  }

  public setApiSpecification (path: string, middlewares: any[]): Either<ServerError, void> {
    try {
      this.app.use(path, ...middlewares)

      console.info(`swagger running: http://localhost:${this.port}${path}`)

      return right()
    } catch (error) {
      console.error('setApiSpecification', error)

      return left(ServerError.create(error.message, error.stack))
    }
  }

  public setContentType (type: string): Either<ServerError, void> {
    try {
      this.app.use((req: Request, res: Response, next: NextFunction): void => {
        res.type(type)
        next()
      })

      return right()
    } catch (error) {
      console.error('setContentType', error)

      return left(ServerError.create(error.message, error.stack))
    }
  }

  public setHeaders (headers: Header[]): Either<ServerError, void> {
    try {
      this.app.use((req: Request, res: Response, next: NextFunction): void => {
        headers.forEach(({ field, value }) => {
          res.set(field, value)
        })
        next()
      })

      return right()
    } catch (error) {
      console.error('setHeaders', error)

      return left(ServerError.create(error.message, error.stack))
    }
  }

  public setRouter (router: Router): Either<ServerError, void> {
    try {
      const { path, routes, middlewares } = router

      for (const route of routes) {
        this.app[route.type](
          '/api' + path + route.path,
          middlewares.map(middleware => this.expressMiddleware(route, middleware)),
          this.expressController(route.controller)
        )

        console.info(`route registered: [${route.type.toUpperCase()}] ${path}${route.path}`)
      }

      return right()
    } catch (error) {
      console.error('setRouter', error)

      return left(ServerError.create(error.message, error.stack))
    }
  }

  public get app (): Express {
    return this._app
  }

  private expressController (controller: Controller<Record<string, unknown>>): RequestHandler {
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

  private log (req: Request, res: Response, next: NextFunction): void {
    console.info(`[${req.method}] ${req.url}`, req.body)

    next()
  }
}
