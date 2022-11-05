import { DomainError } from '@/core/0.domain/base/domain-error'

export type AppRequest<PayloadType> = {
  payload: PayloadType
}

export type AppResponse<PayloadType> = {
  payload: PayloadType | { [key: string]: DomainError[] }
  statusCode: number
}

export abstract class Controller<ConstructParamsType> {
  protected constructor (protected readonly props: ConstructParamsType) {}

  abstract handle (request: AppRequest<any>): Promise<AppResponse<any>>
}
