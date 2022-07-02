import request from 'supertest'

import Controller from '@/2.presentation/base/controller'
import { HttpResponse } from '@/2.presentation/types/http-response'
import { RouteType } from '@/2.presentation/types/route'
import ExpressApp from '@/3.infra/web/express/app/express'

const makeControllerStub = (): Controller => ({
  handle: jest.fn(async (req: any): Promise<HttpResponse> => {
    return { statusCode: 200, body: req.body }
  })
})

type SutTypes = {
  sut: ExpressApp
}

const makeSut = (): SutTypes => {
  const sut = new ExpressApp()

  return { sut }
}

describe('BodyParser', () => {
  describe('success', () => {
    it('parses body as json', async () => {
      const { sut } = makeSut()
      sut.setRoute({
        path: '/test_body_parser',
        type: RouteType.post,
        controller: makeControllerStub()
      })
      const body = { key: 'any_value' }

      await request(sut.app)
        .post('/test_body_parser')
        .send(body)
        .expect(body)
    })

    it('returns default content type as json', async () => {
      const { sut } = makeSut()
      sut.setRoute({
        path: '/test_content_type',
        type: RouteType.get,
        controller: makeControllerStub()
      })

      await request(sut.app)
        .get('/test_content_type')
        .expect('content-type', /json/)
    })

    it('enables CORS', async () => {
      const { sut } = makeSut()
      sut.setRoute({
        path: '/test_cors',
        type: RouteType.get,
        controller: makeControllerStub()
      })

      await request(sut.app)
        .get('/test_cors')
        .expect('access-control-allow-origin', '*')
        .expect('access-control-allow-methods', '*')
        .expect('access-control-allow-headers', '*')
    })
  })
})
