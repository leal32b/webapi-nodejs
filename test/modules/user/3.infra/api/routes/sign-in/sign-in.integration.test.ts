import request from 'supertest'

import { type PersistenceFixture } from '@/core/3.infra/persistence/persistence-fixture'
import { type Route, type WebApp } from '@/core/3.infra/webapp/web-app'
import { app, cryptography, persistence } from '@/core/4.main/container'
import { schemaValidatorMiddleware } from '@/core/4.main/setup/middlewares/schema-validator-middleware'
import { type UserAggregateProps } from '@/user/0.domain/aggregates/user-aggregate'
import { signInRoute } from '@/user/3.infra/api/routes/sign-in/sign-in-route'
import { signInControllerFactory } from '@/user/4.main/factories/sign-in-controller-factory'

import { userFixtures } from '~/user/_fixtures/user-fixtures'

type SutTypes = {
  sut: Route
  userFixture: PersistenceFixture<UserAggregateProps>
  webApp: WebApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    userFixture: userFixtures.userFixture,
    webApp: app.webApp
  }
  const sut = signInRoute(signInControllerFactory())
  collaborators.webApp.setRouter({
    middlewares: [schemaValidatorMiddleware],
    path: '/user',
    routes: [sut]
  })

  return { sut, ...collaborators }
}

describe('SignInRoute', () => {
  beforeAll(async () => {
    await persistence.actual.client.connect()
  })

  afterAll(async () => {
    await persistence.actual.client.clearDatabase()
    await persistence.actual.client.close()
  })

  describe('success', () => {
    it('returns 200 with an accessToken on success', async () => {
      const { userFixture, webApp } = makeSut()
      const email = 'any@mail.com'
      const password = 'any_password'
      const hashedPassword = (await cryptography.hasher.hash(password)).value as string
      await userFixture.createFixture({ email, password: hashedPassword })
      userFixture.createFixture({})

      const { body, statusCode } = await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'any@mail.com',
          password: 'any_password'
        })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        accessToken: expect.any(String),
        message: 'user authenticated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 422 with schema error message when schema is invalid', async () => {
      const { webApp } = makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/user/sign-in')
        .send({})

      expect(statusCode).toBe(422)
      expect(body).toEqual({
        error: {
          instancePath: '',
          keyword: 'required',
          message: "must have required property 'email'",
          params: { missingProperty: 'email' },
          schemaPath: '#/required'
        }
      })
    })

    it('returns 401 with email not found error message when when email is not found', async () => {
      const { webApp } = makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'not_in_base@mail.com',
          password: 'any_password'
        })

      expect(statusCode).toBe(401)
      expect(body).toEqual({
        error: {
          field: 'email',
          input: 'not_in_base@mail.com',
          message: "email 'not_in_base@mail.com' not found"
        }
      })
    })

    it('returns 401 with invalid password error message when when password is invalid', async () => {
      const { userFixture, webApp } = makeSut()
      const email = 'any2@mail.com'
      await userFixture.createFixture({ email })

      const { body, statusCode } = await request(webApp.app)
        .post('/api/user/sign-in')
        .send({
          email: 'any2@mail.com',
          password: 'invalid_password'
        })

      expect(statusCode).toBe(401)
      expect(body).toEqual({
        error: {
          message: 'invalid username or password'
        }
      })
    })
  })
})
