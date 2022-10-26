import request from 'supertest'

import { Controller, AppRequest, AppResponse } from '@/core/2.presentation/base/controller'
import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { RouteType } from '@/core/3.infra/api/app/web-app'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'

const makeAuthStub = (): Controller => ({
  handle: vi.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
})

const makeControllerStub = (): Controller => ({
  handle: vi.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
})

const makeMiddlewareStub = (): Middleware => ({
  handle: vi.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
})

type SutTypes = {
  sut: ExpressAdapter
  auth: Middleware
  controller: Controller
  middleware: Middleware
}

const makeSut = (): SutTypes => {
  const doubles = {
    auth: makeAuthStub(),
    controller: makeControllerStub(),
    middleware: makeMiddlewareStub()
  }

  const sut = new ExpressAdapter()

  return { sut, ...doubles }
}

describe('ExpressAdapter', () => {
  describe('success', () => {
    it('parses body as json', async () => {
      const { sut } = makeSut()
      sut.setRouter({
        path: '/express',
        routes: [{
          path: '/test_body_parser',
          type: RouteType.POST,
          schema: 'any_schema',
          controller: makeControllerStub()
        }],
        middlewares: []
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
        path: '/express',
        routes: [{
          path: '/test_content_type',
          type: RouteType.GET,
          schema: 'any_schema',
          controller: makeControllerStub()
        }],
        middlewares: []
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
        path: '/express',
        routes: [{
          path: '/test_cors',
          type: RouteType.GET,
          schema: 'any_schema',
          controller: makeControllerStub()
        }],
        middlewares: []
      })

      await request(sut.app)
        .get('/api/express/test_cors')
        .expect('access-control-allow-origin', '*')
    })

    it('returns Right on setRouter when route has only a controller', () => {
      const { sut, controller } = makeSut()

      const result = sut.setRouter({
        path: 'any_path',
        routes: [{
          type: RouteType.GET,
          path: 'any_path',
          schema: 'any_schema',
          controller
        }],
        middlewares: []
      })

      expect(result.isRight()).toBe(true)
    })

    it('returns Right on setRouter when route has middlewares', () => {
      const { sut, controller, middleware } = makeSut()

      const result = sut.setRouter({
        path: 'any_path',
        routes: [{
          type: RouteType.GET,
          path: 'any_path',
          schema: 'any_schema',
          controller
        }],
        middlewares: [middleware]
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
        path: 'any_path',
        routes: [{
          type: RouteType.GET,
          path: 'any_path',
          schema: 'any_schema',
          controller
        }],
        middlewares: []
      })

      expect(result.isLeft()).toBe(true)
    })

    it('returns Left when listen throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'listen').mockImplementationOnce(() => {
        throw new Error()
      })
      const port = 0
      const callback = (): any => ({})

      const result = sut.listen(port, callback)

      expect(result.isLeft()).toBe(true)
    })
  })
})
