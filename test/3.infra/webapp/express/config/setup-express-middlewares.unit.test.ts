import request from 'supertest'

import Controller, { AppRequest, AppResponse } from '@/2.presentation/base/controller'
import { RouteType } from '@/3.infra/api/app/web-app'
import ExpressAdapter from '@/3.infra/webapp/express/express-adapter'

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
}

const makeSut = (): SutTypes => {
  const sut = new ExpressAdapter()

  return { sut }
}

describe('BodyParser', () => {
  describe('success', () => {
    it('parses body as json', async () => {
      const { sut } = makeSut()
      sut.setRouter({
        path: '/middleware',
        routes: [{
          path: '/test_body_parser',
          type: RouteType.POST,
          controller: makeControllerStub()
        }]
      })
      const body = { key: 'any_value' }

      await request(sut.app)
        .post('/api/middleware/test_body_parser')
        .send(body)
        .expect(body)
    })
  })
})

describe('ContentTypes', () => {
  describe('success', () => {
    it('returns default content type as json', async () => {
      const { sut } = makeSut()
      sut.setRouter({
        path: '/middleware',
        routes: [{
          path: '/test_content_type',
          type: RouteType.GET,
          controller: makeControllerStub()
        }]
      })

      await request(sut.app)
        .get('/api/middleware/test_content_type')
        .expect('content-type', /json/)
    })
  })
})

describe('CORS', () => {
  describe('success', () => {
    it('enables CORS', async () => {
      const { sut } = makeSut()
      sut.setRouter({
        path: '/middleware',
        routes: [{
          path: '/test_cors',
          type: RouteType.GET,
          controller: makeControllerStub()
        }]
      })

      await request(sut.app)
        .get('/api/middleware/test_cors')
        .expect('access-control-allow-origin', '*')
        .expect('access-control-allow-methods', '*')
        .expect('access-control-allow-headers', '*')
    })
  })
})
