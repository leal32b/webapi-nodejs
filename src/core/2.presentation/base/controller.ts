import { DomainError } from '@/core/0.domain/base/domain-error'

export type AppRequest<T> = {
  payload: T
}

export type AppResponse<T> = {
  payload: T | DomainError[]
  statusCode: number
}

export abstract class Controller {
  abstract handle (request: AppRequest<any>): Promise<AppResponse<any>>
}
