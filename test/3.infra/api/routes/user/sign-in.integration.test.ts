import request from 'supertest'

import { Route } from '@/3.infra/api/app/web-app'
import signInRoute from '@/3.infra/api/routes/user/sign-in-route'
import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/3.infra/persistence/postgres/data-sources/test'
import PgUserFactory from '@/3.infra/persistence/postgres/factories/user-factory'
import ExpressApp from '@/3.infra/webapp/express/express-adapter'
import { config } from '@/4.main/config/config'
import signInControllerFactory from '@/4.main/factories/user/sign-in-controller-factory'

type SutTypes = {
  sut: Route
  pgUserFactory: PgUserFactory
  expressApp: ExpressApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    pgUserFactory: PgUserFactory.create(),
    expressApp: new ExpressApp()
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
      const { sut, pgUserFactory, expressApp } = makeSut()
      const email = 'any@mail.com'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await pgUserFactory.createFixtures({ email, password: hashedPassword })
      expressApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(expressApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'any@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })

    it('returns an accessToken on success', async () => {
      const { sut, pgUserFactory, expressApp } = makeSut()
      const email = 'any2@mail.com'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await pgUserFactory.createFixtures({ email, password: hashedPassword })
      expressApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(expressApp.app)
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
      const { sut, expressApp } = makeSut()
      expressApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(expressApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'not_in_base@mail.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
