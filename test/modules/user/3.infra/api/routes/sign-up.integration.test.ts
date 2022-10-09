import request from 'supertest'

import { Route, WebApp } from '@/core/3.infra/api/app/web-app'
import { DatabaseFactory } from '@/core/3.infra/persistence/database-factory'
import { config } from '@/core/4.main/config/config'
import { factories } from '@/core/4.main/config/database-factories'
import { schemaValidatorMiddlewareFactory } from '@/core/4.main/factories/schema-validator-middleware-factory'
import { UserAggregateCreateParams } from '@/user/0.domain/aggregates/user-aggregate'
import { signUpRoute } from '@/user/3.infra/api/routes/sign-up-route'
import { signUpControllerFactory } from '@/user/4.main/factories/sign-up-controller-factory'

type SutTypes = {
  sut: Route
  userFactory: DatabaseFactory<UserAggregateCreateParams>
  webApp: WebApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    userFactory: factories.userFactory,
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
    await config.persistence.connect()
  })

  afterAll(async () => {
    await config.persistence.clear()
    await config.persistence.close()
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

      expect(result.body).toEqual({
        error: {
          instancePath: '',
          keyword: 'required',
          message: "must have required property 'name'",
          params: { missingProperty: 'name' },
          schemaPath: '#/required'
        }
      })
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

      expect(result.body).toEqual({
        error: {
          field: 'password',
          message: 'passwords should match'
        }
      })
    })

    it('returns 400 when email is already in use', async () => {
      const { userFactory, webApp } = makeSut()
      const email = 'any2@mail.com'
      await userFactory.createFixture({ email })

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
      const { userFactory, webApp } = makeSut()
      const email = 'any3@mail.com'
      await userFactory.createFixture({ email })

      const result = await request(webApp.app)
        .post('/api/user/sign-up')
        .send({
          name: 'any_name',
          email: 'any3@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })

      expect(result.body).toEqual({
        error: {
          input: 'any3@mail.com',
          field: 'email',
          message: 'email already in use'
        }
      })
    })
  })
})
