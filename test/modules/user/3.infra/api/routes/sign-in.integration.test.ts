import request from 'supertest'

import { Route, WebApp } from '@/core/3.infra/api/app/web-app'
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { config } from '@/core/4.main/config/config'
import { signInRoute } from '@/user/3.infra/api/routes/sign-in-route'
import { PgUserFactory } from '@/user/3.infra/persistence/postgres/factories/user-factory'
import { signInControllerFactory } from '@/user/4.main/factories/sign-in-controller-factory'

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
  const sut = signInRoute(signInControllerFactory())

  return { sut, ...collaborators }
}

describe('SignInRoute', () => {
  beforeAll(async () => {
    await pg.connect(testDataSource)
  })

  afterAll(async () => {
    await pg.client.clearDatabase()
    await pg.client.close()
  })

  describe('success', () => {
    it('returns 200 on success', async () => {
      const { sut, pgUserFactory, webApp } = makeSut()
      const email = 'any@mail.com'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await pgUserFactory.createFixtures({ email, password: hashedPassword })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'any@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })

    it('returns an accessToken on success', async () => {
      const { sut, pgUserFactory, webApp } = makeSut()
      const email = 'any2@mail.com'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await pgUserFactory.createFixtures({ email, password: hashedPassword })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'any2@mail.com',
          password: 'any_password'
        })

      expect(result.body).toEqual({
        accessToken: expect.any(String),
        message: 'user authenticated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 401 when when email is not found', async () => {
      const { sut, webApp } = makeSut()
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'not_in_base@mail.com',
          password: 'any_password'
        })
        .expect(401)
    })

    it('returns email not found error message', async () => {
      const { sut, webApp } = makeSut()
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'not_in_base@mail.com',
          password: 'any_password'
        })
        .expect(401)

      expect(result.body).toEqual([{
        props: {
          input: 'not_in_base@mail.com',
          field: 'email',
          message: 'email "not_in_base@mail.com" not found'
        }
      }])
    })

    it('returns 401 when when password is invalid', async () => {
      const { sut, pgUserFactory, webApp } = makeSut()
      const email = 'any3@mail.com'
      await pgUserFactory.createFixtures({ email })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'any3@mail.com',
          password: 'invalid_password'
        })
        .expect(401)
    })

    it('returns invalid password error message', async () => {
      const { sut, pgUserFactory, webApp } = makeSut()
      const email = 'any4@mail.com'
      await pgUserFactory.createFixtures({ email })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'any4@mail.com',
          password: 'any_password'
        })
        .expect(401)

      expect(result.body).toEqual([{
        props: {
          message: 'invalid username or password'
        }
      }])
    })
  })
})
