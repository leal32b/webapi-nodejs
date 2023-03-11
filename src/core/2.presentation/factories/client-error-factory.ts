import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type AppResponse } from '@/core/2.presentation/base/controller'

export enum ClientErrorStatus {
  badRequest = 'bad_request',
  unauthorized = 'unauthorized'
}

export const clientError = {
  badRequest (errors: DomainError[]): AppResponse<any> {
    return {
      payload: adaptErrors(errors),
      statusCode: 400
    }
  },

  unauthorized (errors: DomainError[]): AppResponse<any> {
    return {
      payload: adaptErrors(errors),
      statusCode: 401
    }
  },

  unprocessableEntity (errors: any[]): AppResponse<any> {
    const payload = errors.length === 1 ? { error: errors[0] } : { errors }

    return {
      payload,
      statusCode: 422
    }
  }
}

const adaptErrors = (errors: DomainError[]): any => {
  if (errors.length === 1) {
    return { error: errors[0].props }
  }

  return { errors: errors.map(error => error.props) }
}
