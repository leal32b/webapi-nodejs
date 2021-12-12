import ServerError from '@/2.adapter/errors/server-error'
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
  })
}

export const serverError = {
  internalServerError: (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack)
  })
}
