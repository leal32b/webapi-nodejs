import { type Controller } from '@/core/2.presentation/base/controller'
import { type Middleware } from '@/core/2.presentation/middleware/middleware'

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
  listen: (port: number) => void
  setApiSpecification: (path: string, middlewares: any[]) => void
  setContentType: (type: string) => void
  setHeaders: (headers: Header[]) => void
  setRouter: (router: Router) => void
}
