import express from 'express'

import { type Middleware } from '@/common/1.application/middleware/middleware'
import { type Controller, type AppRequest, type AppResponse } from '@/common/2.presentation/base/controller'
import { ServerError } from '@/common/2.presentation/errors/server.error'
import { ExpressAdapter } from '@/common/3.infra/webapp/express/express.adapter'
import { RouteType } from '@/common/3.infra/webapp/web-app'

import { makeLoggerMock } from '~/common/_doubles/mocks/logger.mock'

vi.mock('express', () => ({
  default: vi.fn(() => ({
    address: vi.fn(),
    get: vi.fn(),
    listen: vi.fn(),
    use: vi.fn()
  })),
  json: vi.fn()
}))

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
    it('calls app.listen with correct params', async () => {
      const listen = vi.fn()
      vi.mocked(express).mockImplementationOnce(() => ({
        listen,
        use: vi.fn()
      } as any))
      const { sut } = makeSut()

      sut.listen()

      expect(listen).toHaveBeenCalledWith(0, null)
    })

    it('returns Right when listen succeeds', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'listen').mockReturnValueOnce(null)

      const result = sut.listen()

      expect(result.isRight()).toBe(true)
    })

    it('returns Right on setApiSpecification', () => {
      const { sut } = makeSut()
      const path = 'any_path'
      const config = { anyKey: 'any_value' }

      const result = sut.setApiSpecification(path, config)

      expect(result.isRight()).toBe(true)
    })

    it('calls app.<routeType> with correct params', async () => {
      const get = vi.fn()
      vi.mocked(express).mockImplementationOnce(() => ({
        get,
        use: vi.fn()
      } as any))
      const { sut } = makeSut()

      sut.setRouter({
        middlewares: [],
        path: '/express',
        routes: [{
          controller: makeControllerStub(),
          path: '/test_body_parser',
          schema: {},
          type: RouteType.GET
        }]
      })

      expect(get).toHaveBeenCalledWith(
        '/api/express/test_body_parser',
        [],
        expect.any(Function)
      )
    })

    it('returns Right on setRouter', async () => {
      const { sut } = makeSut()

      const result = sut.setRouter({
        middlewares: [],
        path: '/express',
        routes: [{
          controller: makeControllerStub(),
          path: '/test_body_parser',
          schema: {},
          type: RouteType.GET
        }]
      })

      expect(result.isRight()).toBe(true)
    })

    it('calls app.use with correct params', async () => {
      const use = vi.fn()
      vi.mocked(express).mockImplementationOnce(() => ({ use } as any))
      const { sut } = makeSut()
      const type = 'any_type'

      sut.setContentType(type)

      expect(use).toHaveBeenCalledWith(expect.any(Function))
    })

    it('returns Right on setContentType', () => {
      const { sut } = makeSut()
      const type = 'any_type'

      const result = sut.setContentType(type)

      expect(result.isRight()).toBe(true)
    })

    it('returns Right on setHeaders', () => {
      const { sut } = makeSut()
      const headers = [{ field: 'any_field', value: 'any_value' }]

      const result = sut.setHeaders(headers)

      expect(result.isRight()).toBe(true)
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

      expect(result).toEqual(expect.any(Object))
    })
  })

  describe('failure', () => {
    it('returns Left with ServerError when setApiSpecification throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'use').mockImplementationOnce(() => {
        throw new Error()
      })
      const path = 'any_path'
      const config = { anyKey: 'any_value' }

      const result = sut.setApiSpecification(path, config)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when setContentType throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'use').mockImplementationOnce(() => {
        throw new Error()
      })
      const type = 'any_type'

      const result = sut.setContentType(type)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when setHeaders throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'use').mockImplementationOnce(() => {
        throw new Error()
      })
      const headers = [{ field: 'any_field', value: 'any_value' }]

      const result = sut.setHeaders(headers)

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when setRouter throws', () => {
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
      expect(result.value).toBeInstanceOf(ServerError)
    })

    it('returns Left with ServerError when listen throws', () => {
      const { sut } = makeSut()
      vi.spyOn(sut.app, 'listen').mockImplementationOnce(() => {
        throw new Error()
      })

      const result = sut.listen()

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ServerError)
    })
  })
})
