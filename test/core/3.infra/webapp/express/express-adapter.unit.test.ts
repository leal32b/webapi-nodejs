import { Controller, AppRequest, AppResponse } from '@/core/2.presentation/base/controller'
import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { RouteType } from '@/core/3.infra/api/app/web-app'
import { ExpressAdapter } from '@/core/3.infra/webapp/express/express-adapter'

const makeAuthStub = (): Controller => ({
  handle: jest.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
})

const makeControllerStub = (): Controller => ({
  handle: jest.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
    payload: request.payload,
    statusCode: 200
  }))
})

const makeMiddlewareStub = (): Middleware => ({
  handle: jest.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => ({
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
      jest.spyOn(sut.app, 'listen').mockReturnValueOnce(null)
      const port = 0

      const result = sut.listen(port)

      expect(result.isRight()).toBe(true)
    })
  })

  describe('failure', () => {
    it('returns Left when setRouter throws', () => {
      const { sut, controller } = makeSut()
      jest.spyOn(sut.app, 'get').mockImplementationOnce(() => {
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
      jest.spyOn(sut.app, 'listen').mockImplementationOnce(() => {
        throw new Error()
      })
      const port = 0
      const callback = (): any => ({})

      const result = sut.listen(port, callback)

      expect(result.isLeft()).toBe(true)
    })
  })
})
