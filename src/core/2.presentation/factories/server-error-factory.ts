import { AppResponse } from '@/core/2.presentation/base/controller'
import { ServerError } from '@/core/2.presentation/errors/server-error'

export enum ServerErrorStatus {
  internalServerError = 'internal_server_error',
}

export const serverError = {
  internalServerError (error: any): AppResponse<typeof error> {
    const serverError = new ServerError(error.message, error.stack)

    return {
      payload: serverError,
      statusCode: 500
    }
  }
}