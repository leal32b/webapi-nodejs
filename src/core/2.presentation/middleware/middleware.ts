import { AppRequest, AppResponse } from '@/core/2.presentation/base/controller'

export type MiddlewareRequest = AppRequest<any> & {
  accessToken?: string
  schema?: Object
}

export interface Middleware {
  handle: (request: MiddlewareRequest) => Promise<AppResponse<any>>
}
