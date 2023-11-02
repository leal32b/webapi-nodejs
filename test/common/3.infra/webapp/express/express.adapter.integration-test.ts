import request from 'supertest'

import { type Middleware } from '@/common/1.application/middleware/middleware'
import { type Controller, type AppRequest, type AppResponse } from '@/common/2.presentation/base/controller'
import { ExpressAdapter } from '@/common/3.infra/webapp/express/express.adapter'
import { RouteType } from '@/common/3.infra/webapp/web-app'

import { makeLoggerMock } from '~/common/_doubles/mocks/logger.mock'

const makeAuthStub = (): Controller<Record<string, unknown>> => ({
  handle: vi.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
} as any)

const makeControllerStub = (): Controller<Record<string, unknown>> => ({
  handle: vi.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
} as any)

const makeMiddlewareStub = (): Middleware => ({
  handle: vi.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
})

type SutTypes = {
  auth: Middleware
  controller: Controller<Record<string, unknown>>
  middleware: Middleware
  sut: ExpressAdapter
}

const makeSut = (): SutTypes => {
  const doubles = {
    auth: makeAuthStub(),
    controller: makeControllerStub(),
    middleware: makeMiddlewareStub()
  }
  const sut = ExpressAdapter.create({
    logger: makeLoggerMock(),
    port: 0
  })

  return {
    ...doubles,
    sut
  }
}

describe('ExpressAdapter', () => {
  describe('success', () => {
    it('enables CORS', async () => {
      const { sut, controller } = makeSut()
      sut.setHeaders([{ field: 'access-control-allow-origin', value: '*' }])
      sut.setRouter({
        middlewares: [],
        path: '/express',
        routes: [{
          controller,
          path: '/test_cors',
          schema: {},
          type: RouteType.GET
        }]
      })

      const result = await request(sut.app).get('/api/express/test_cors')

      expect(result.headers).include({ 'access-control-allow-origin': '*' })
    })

    it('returns default contentType as json', async () => {
      const { sut } = makeSut()
      sut.setContentType('json')
      sut.setRouter({
        middlewares: [],
        path: '/express',
        routes: [{
          controller: makeControllerStub(),
          path: '/test_content_type',
          schema: {},
          type: RouteType.GET
        }]
      })

      const result = await request(sut.app).get('/api/express/test_content_type')

      expect(result.headers).include({ 'content-type': 'application/json; charset=utf-8' })
    })

    it('sets middlewares', async () => {
      const { sut, middleware } = makeSut()
      const middlewareReturningError = { ...middleware }
      vi.spyOn(middlewareReturningError, 'handle').mockImplementationOnce(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
        payload: request.payload,
        statusCode: 500
      }))
      sut.setContentType('json')
      sut.setRouter({
        middlewares: [middleware, middlewareReturningError],
        path: '/express',
        routes: [{
          controller: makeControllerStub(),
          path: '/test_content_type',
          schema: {},
          type: RouteType.GET
        }]
      })

      const result = await request(sut.app).get('/api/express/test_content_type')

      expect(result.headers).include({ 'content-type': 'application/json; charset=utf-8' })
    })
  })
})
