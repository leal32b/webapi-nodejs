import { type DomainError } from '@/common/0.domain/base/domain-error'

export type AppRequest<PayloadType> = {
  payload: PayloadType
}

export type AppResponse<PayloadType> = {
  payload: PayloadType | Record<string, DomainError[]>
  statusCode: number
}

export abstract class Controller<PropsType> {
  protected constructor (protected readonly props: PropsType) {}

  abstract handle (request: AppRequest<any>): Promise<AppResponse<any>>
}
