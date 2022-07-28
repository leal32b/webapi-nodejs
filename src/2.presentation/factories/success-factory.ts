import { AppResponse } from '@/2.presentation/base/controller'

export const success = {
  ok (payload: any): AppResponse<typeof payload> {
    return {
      payload,
      statusCode: 200
    }
  }
}
