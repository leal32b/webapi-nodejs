import { AppResponse } from '@/2.presentation/base/controller'

export enum SuccessStatus {
  ok = 'ok'
}

export const success = {
  ok (payload: any): AppResponse<typeof payload> {
    return {
      payload,
      status: SuccessStatus.ok
    }
  }
}
