import { Controller } from '@/core/2.presentation/base/controller'
import { Middleware } from '@/core/2.presentation/middleware/middleware'

export enum RouteType {
  POST = 'post',
  GET = 'get'
}

export type Route = {
  path: string
  type: RouteType
  schema: Object
  controller: Controller
  auth?: string[]
}

export type Router = {
  path: string
  routes: Route[]
  middlewares: Middleware[]
}

export interface WebApp {
  app: any
  listen: (port: number, callback: () => void) => void
  setRouter: (router: Router) => void
}
