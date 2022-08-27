import { AppResponse } from '@/core/2.presentation/base/controller'

export enum ClientErrorStatus {
  badRequest = 'bad_request',
  unauthorized = 'unauthorized'
}

export const clientError = {
  badRequest (error: any): AppResponse<typeof error> {
    return {
      payload: error,
      statusCode: 400
    }
  },

  unauthorized (error: any): AppResponse<typeof error> {
    return {
      payload: error,
      statusCode: 401
    }
  },

  unprocessableEntity (error: any): AppResponse<typeof error> {
    return {
      payload: error,
      statusCode: 422
    }
  }
}
