import ServerError from '@/2.adapter/errors/server-error'
import UnauthorizedError from '@/2.adapter/errors/unauthorized-error'
import { HttpResponse } from '@/2.adapter/types/http'

export const success = {
  ok: (data: any): HttpResponse => ({
    statusCode: 200,
    body: data
  })
}

export const clientError = {
  badRequest: (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error
  }),
  unauthorized: (): HttpResponse => ({
    statusCode: 401,
    body: new UnauthorizedError()
  })
}

export const serverError = {
  internalServerError: (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack)
  })
}
