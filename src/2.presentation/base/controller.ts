import DomainError from '@/0.domain/base/domain-error'

export type AppRequest<T> = {
  payload: T
}

export type AppResponse<T> = {
  payload: T | DomainError[]
  status: string
}

export default abstract class Controller {
  abstract handle (request: AppRequest<any>): Promise<AppResponse<any>>
}
