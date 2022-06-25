import Controller from '@/2.presentation/base/controller'

export enum RouteType {
  post = 'post'
}

export type Route = {
  path: string
  type: RouteType
  controller: Controller
}
