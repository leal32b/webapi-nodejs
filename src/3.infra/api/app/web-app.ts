import Controller from '@/2.presentation/base/controller'

export enum RouteType {
  POST = 'post',
  GET = 'get'
}

export type Route = {
  path: string
  type: RouteType
  controller: Controller
  schema?: any
  auth?: any
}

export type Router = {
  path: string
  routes: Route[]
}

export default interface WebApp {
  listen: (port: number, callback: () => void) => void
  setRouter: (router: Router) => void
}
