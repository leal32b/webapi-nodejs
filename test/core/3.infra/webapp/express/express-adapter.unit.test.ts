import request from 'supertest'

import { type Controller, type AppRequest, type AppResponse } from '@/core/2.presentation/base/controller'
import { type Middleware } from '@/core/2.presentation/middleware/middleware'
import { RouteType } from '@/core/3.infra/api/app/web-app'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'

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
  sut: ExpressAdapter
  auth: Middleware
  controller: Controller<Record<string, unknown>>
  middleware: Middleware
}

const makeSut = (): SutTypes => {
  const doubles = {
    auth: makeAuthStub(),
    controller: makeControllerStub(),
    middleware: makeMiddlewareStub()
  }

  const sut = ExpressAdapter.create(0)

  return { sut, ...doubles }
}

describe('ExpressAdapter', () => {
  describe('success', () => {
    it('parses body as json', async () => {
      const { sut } = makeSut()
      sut.setRouter({
        middlewares: [],
        path: '/express',
        routes: [{
          controller: makeControllerStub(),
          path: '/test_body_parser',
          schema: {},
          type: RouteType.POST
        }]
      })
      const body = { key: 'any_value' }

      await request(sut.app)
        .post('/api/express/test_body_parser')
        .send(body)
        .expect(body)
    })

    it('returns Right on setApiSpecification', () => {
      const { sut } = makeSut()
      const path = 'any_path'
      const middlewares = [() => {}, () => {}]

      const result = sut.setApiSpecification(path, middlewares)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right on setContentType', () => {
      const { sut } = makeSut()
      const type = 'any_type'

      const result = sut.setContentType(type)

      expect(result.isRight()).toBe(true)
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

      await request(sut.app)
        .get('/api/express/test_content_type')
        .expect('content-type', /json/)
    })

    it('returns Right on setHeaders', () => {
      const { sut } = makeSut()
      const headers = [{ field: 'any_field', value: 'any_value' }]

      const result = sut.setHeaders(headers)

      expect(result.isRight()).toBe(true)
    })

    it('enables CORS', async () => {
      const { sut } = makeSut()
      sut.setHeaders([{ field: 'access-control-allow-origin', value: '*' }])
      sut.setRouter({
        middlewares: [],
        path: '/express',
        routes: [{
          controller: makeControllerStub(),
          path: '/test_cors',
          schema: {},
          type: RouteType.GET
        }]
      })

      await request(sut.app)
        .get('/api/express/test_cors')
        .expect('access-control-allow-origin', '*')
    })

    it('returns Right on setRouter when route has only a controller', () => {
      const { sut, controller } = makeSut()

      const result = sut.setRouter({
        middlewares: [],
        path: 'any_path',
        routes: [{
          controller,
          path: 'any_path',
          schema: {},
          type: RouteType.GET
        }]
      })

      expect(result.isRight()).toBe(true)
    })

    it('returns Right on setRouter when route has middlewares', () => {
      const { sut, controller, middleware } = makeSut()

      const result = sut.setRouter({
        middlewares: [middleware],
        path: 'any_path',
        routes: [{
          controller,
          path: 'any_path',
          schema: {},
          type: RouteType.GET
        }]
      })

      expect(result.isRight()).toBe(true)
    })

    it('gets the app', () => {
      const { sut } = makeSut()

      const result = sut.app

      expect(result).toBeInstanceOf(Function)
    })

    it('returns Right when listen succeeds', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'listen').mockReturnValueOnce(null)
      const port = 0

      const result = sut.listen(port)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when setApiSpecification throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'use').mockImplementationOnce(() => {
        throw new Error()
      })
      const path = 'any_path'
      const middlewares = [() => {}, () => {}]

      const result = sut.setApiSpecification(path, middlewares)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when setContentType throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'use').mockImplementationOnce(() => {
        throw new Error()
      })
      const type = 'any_type'

      const result = sut.setContentType(type)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when setHeaders throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'use').mockImplementationOnce(() => {
        throw new Error()
      })
      const headers = [{ field: 'any_field', value: 'any_value' }]

      const result = sut.setHeaders(headers)

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when setRouter throws', () => {
      const { sut, controller } = makeSut()
      vi.spyOn(sut.app, 'get').mockImplementationOnce(() => {
        throw new Error()
      })

      const result = sut.setRouter({
        middlewares: [],
        path: 'any_path',
        routes: [{
          controller,
          path: 'any_path',
          schema: {},
          type: RouteType.GET
        }]
      })

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when listen throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'listen').mockImplementationOnce(() => {
        throw new Error()
      })

      const result = sut.listen()

      expect(result.isLeft()).toBe(true)
    })
  })
})
