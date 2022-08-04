import { Controller, AppRequest, AppResponse } from '@/2.presentation/base/controller'
import { RouteType } from '@/3.infra/api/app/web-app'
import { ExpressAdapter } from '@/3.infra/webapp/express/express-adapter'

const makeControllerStub = (): Controller => ({
  handle: jest.fn(async (request: AppRequest<any>): Promise<AppResponse<any>> => {
    return {
      payload: request.payload,
      statusCode: 200
    }
  })
})

type SutTypes = {
  sut: ExpressAdapter
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const fakes = {
    controllerStub: makeControllerStub()
  }

  const sut = new ExpressAdapter()

  return { sut, ...fakes }
}

describe('ExpressAdapter', () => {
  describe('success', () => {
    it('returns Right when setRouter succeeds', () => {
      const { sut, controllerStub } = makeSut()

      const result = sut.setRouter({
        path: 'any_path',
        routes: [{
          type: RouteType.GET,
          path: 'any_path',
          controller: controllerStub
        }]
      })

      expect(result.isRight()).toBe(true)
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
      const { sut, controllerStub } = makeSut()
      jest.spyOn(sut.app, 'get').mockImplementationOnce(() => {
        throw new Error()
      })

      const result = sut.setRouter({
        path: 'any_path',
        routes: [{
          type: RouteType.GET,
          path: 'any_path',
          controller: controllerStub
        }]
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
