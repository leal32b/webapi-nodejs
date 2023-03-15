import { type AppResponse } from '@/core/2.presentation/base/controller'

export enum ServerErrorStatus {
  internalServerError = 'internal_server_error',
}

export const serverError = {
  internalServerError (error: any): AppResponse<typeof error> {
    console.error(error)

    return {
      payload: {
        error: {
          message: 'internal server error'
        }
      },
      statusCode: 500
    }
  }
}
