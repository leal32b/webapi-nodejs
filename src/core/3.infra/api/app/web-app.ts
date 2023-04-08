import { type Either } from '@/core/0.domain/utils/either'
import { type Controller } from '@/core/2.presentation/base/controller'
import { type ServerError } from '@/core/2.presentation/errors/server-error'
import { type Middleware } from '@/core/2.presentation/middleware/middleware'
import { type ApiDocumenter } from '@/core/3.infra/documentation/api-documenter'

export enum RouteType {
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
  setApiSpecification: (path: string, apiDocumenter: ApiDocumenter) => Either<ServerError, void>
  setContentType: (type: string) => Either<ServerError, void>
  setHeaders: (headers: Header[]) => Either<ServerError, void>
  setRouter: (router: Router) => Either<ServerError, void>
}
