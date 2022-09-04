import request from 'supertest'

import { Route, WebApp } from '@/core/3.infra/api/app/web-app'
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { config } from '@/core/4.main/config/config'
import { schemaValidatorMiddlewareFactory } from '@/core/4.main/factories/schema-validator-middleware-factory'
import { signUpRoute } from '@/user/3.infra/api/routes/sign-up-route'
import { PgUserFactory } from '@/user/3.infra/persistence/postgres/factories/user-factory'
import { signUpControllerFactory } from '@/user/4.main/factories/sign-up-controller-factory'

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
  collaborators.webApp.setRouter({
    path: '/user',
    routes: [sut],
    middlewares: [schemaValidatorMiddlewareFactory()]
  })

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
      const { webApp } = makeSut()

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
      const { webApp } = makeSut()

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
    it('returns 400 when schema is invalid', async () => {
      const { webApp } = makeSut()

      await request(webApp.app)
        .post('/api/user/sign-up')
        .send({})
        .expect(422)
    })

    it('returns schema error message when schema is invalid', async () => {
      const { webApp } = makeSut()

      const result = await request(webApp.app)
        .post('/api/user/sign-up')
        .send({})

      expect(result.body).toEqual([{
        instancePath: '',
        keyword: 'required',
        message: "must have required property 'name'",
        params: { missingProperty: 'name' },
        schemaPath: '#/required'
      }])
    })

    it('returns 400 when passwords do not match', async () => {
      const { webApp } = makeSut()

      await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any@mail.com',
          password: 'any_password',
          passwordRetype: 'another_password'
        })
        .expect(400)
    })

    it('returns passwords should match error message', async () => {
      const { webApp } = makeSut()

      const result = await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any@mail.com',
          password: 'any_password',
          passwordRetype: 'another_password'
        })

      expect(result.body).toEqual([{
        props: {
          field: 'password',
          message: 'passwords should match'
        }
      }])
    })

    it('returns 400 when email is already in use', async () => {
      const { pgUserFactory, webApp } = makeSut()
      const email = 'any2@mail.com'
      await pgUserFactory.createFixtures({ email })

      await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any2@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })
        .expect(400)
    })

    it('returns email already in use error message', async () => {
      const { pgUserFactory, webApp } = makeSut()
      const email = 'any3@mail.com'
      await pgUserFactory.createFixtures({ email })

      const result = await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any3@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })

      expect(result.body).toEqual([{
        props: {
          input: 'any3@mail.com',
          field: 'email',
          message: 'email already in use'
        }
      }])
    })
  })
})
