import { AppResponse } from '@/2.presentation/base/controller'

export enum ClientErrorStatus {
  badRequest = 'bad_request',
  unauthorized = 'unauthorized'
}

export const clientError = {
  badRequest (error: any): AppResponse<typeof error> {
    return {
      payload: error,
      status: ClientErrorStatus.badRequest
    }
  },

  unauthorized (error: any): AppResponse<typeof error> {
    return {
      payload: error,
      status: ClientErrorStatus.unauthorized
    }
  }
}
