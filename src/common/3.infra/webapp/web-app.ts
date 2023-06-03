import { type Either } from '@/common/0.domain/utils/either'
import { type Middleware } from '@/common/1.application/middleware/middleware'
import { type Controller } from '@/common/2.presentation/base/controller'
import { type ServerError } from '@/common/2.presentation/errors/server-error'

export enum RouteType {
  PATCH = 'patch',
  POST = 'post',
  GET = 'get'
}

export type Route = {
  path: string
  type: RouteType
  schema: Record<string, unknown>
  controller: Controller<Record<string, unknown>>
  auth?: string[]
}

export type Router = {
  path: string
  routes: Route[]
  middlewares: Middleware[]
}

export type Header = {
  field: string
  value: string
}
export interface WebApp {
  app: any
  listen: (callback?: () => void) => Either<ServerError, void>
  setApiSpecification: (path: string, config: Record<string, unknown>) => Either<ServerError, void>
  setContentType: (type: string) => Either<ServerError, void>
  setHeaders: (headers: Header[]) => Either<ServerError, void>
  setRouter: (router: Router) => Either<ServerError, void>
}
