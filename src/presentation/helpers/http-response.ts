import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

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
  })
}

export const serverError = {
  internalServerError: (): HttpResponse => ({
    statusCode: 500,
    body: new ServerError()
  })
}
