import request from 'supertest'

import { Route, WebApp } from '@/3.infra/api/app/web-app'
import { signUpRoute } from '@/3.infra/api/routes/user/sign-up-route'
import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/3.infra/persistence/postgres/data-sources/test'
import { PgUserFactory } from '@/3.infra/persistence/postgres/factories/user-factory'
import { config } from '@/4.main/config/config'
import { signUpControllerFactory } from '@/4.main/factories/user/sign-up-controller-factory'

type SutTypes = {
  sut: Route
  pgUserFactory: PgUserFactory
  webApp: WebApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    pgUserFactory: PgUserFactory.create(),
    webApp: config.app.webApp
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
      const { sut, webApp } = makeSut()
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })
        .expect(200)
    })

    it('returns an email on success', async () => {
      const { sut, webApp } = makeSut()
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(webApp.app)
        .post('/api/user/sign-up')
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

  describe('failure', () => {
    it('returns 400 when email is already in use', async () => {
      const { sut, pgUserFactory, webApp } = makeSut()
      const email = 'any@mail.com'
      await pgUserFactory.createFixtures({ email })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })
        .expect(400)
    })

    it('returns email already in use error message', async () => {
      const { sut, pgUserFactory, webApp } = makeSut()
      const email = 'any@mail.com'
      await pgUserFactory.createFixtures({ email })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })

      expect(result.body).toEqual([{
        props: {
          message: 'email already in use',
          field: 'email',
          input: 'any@mail.com'
        }
      }])
    })
  })
})
