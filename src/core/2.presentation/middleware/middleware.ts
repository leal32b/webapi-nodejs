import { type AppRequest, type AppResponse } from '@/core/2.presentation/base/controller'

export type MiddlewareRequest = AppRequest<any> & {
  accessToken?: string
  auth?: string[]
  schema?: Record<string, unknown>
}

export interface Middleware {
  handle: (request: MiddlewareRequest) => Promise<AppResponse<any>>
}
