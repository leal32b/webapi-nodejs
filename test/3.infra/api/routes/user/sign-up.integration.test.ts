import request from 'supertest'

import { Route } from '@/3.infra/api/app/web-app'
import signUpRoute from '@/3.infra/api/routes/user/sign-up-route'
import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/3.infra/persistence/postgres/data-sources/test'
import ExpressApp from '@/3.infra/webapp/express/express-adapter'
import signUpControllerFactory from '@/4.main/factories/user/sign-up-controller-factory'

type SutTypes = {
  sut: Route
  expressApp: ExpressApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    expressApp: new ExpressApp()
  }
  const sut = signUpRoute(signUpControllerFactory())

  return { sut, ...collaborators }
}

describe('SignUpRoute', () => {
  beforeAll(async () => {
    await pg.connect(testDataSource)
  })

  afterAll(async () => {
    await pg.client.clearDatabase()
    await pg.client.close()
  })

  describe('success', () => {
    it('returns 200 on success', async () => {
      const { sut, expressApp } = makeSut()
      expressApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(expressApp.app)
        .post('/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })
        .expect(200)
    })

    it('returns an email on success', async () => {
      const { sut, expressApp } = makeSut()
      expressApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(expressApp.app)
        .post('/user/sign-up')
        .send({
          name: 'any_name',
          email: 'another@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })

      expect(result.body).toEqual({
        email: expect.any(String),
        message: 'user created successfully'
      })
    })
  })
})
