import DomainError from '@/0.domain/base/domain-error'
import ServerError from '@/2.presentation/errors/server'
import { HttpResponse } from '@/2.presentation/types/http-response'

export const success = {
  ok: (data: any): HttpResponse => ({
    statusCode: 200,
    body: data
  })
}

export const clientError = {
  badRequest: (error: DomainError[]): HttpResponse => ({
    statusCode: 400,
    body: error
  }),
  unauthorized: (error: DomainError[]): HttpResponse => ({
    statusCode: 401,
    body: error
  })
}

export const serverError = {
  internalServerError: (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.message, error.stack)
  })
}
