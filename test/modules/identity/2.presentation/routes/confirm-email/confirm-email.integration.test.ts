import request from 'supertest'

import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence-fixture'
import { type WebApp, type Route } from '@/common/3.infra/webapp/web-app'
import { app, persistence } from '@/common/4.main/container'
import { schemaValidatorMiddleware } from '@/common/4.main/setup/middlewares/schema-validator-middleware'

import { type UserAggregateProps } from '@/identity/0.domain/aggregates/user-aggregate'
import { confirmEmailRoute } from '@/identity/2.presentation/routes/confirm-email/confirm-email-route'
import { confirmEmailControllerFactory } from '@/identity/4.main/factories/confirm-email-controller-factory'

import { userFixtures } from '~/identity/_fixtures/user-fixtures'
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
  const sut = confirmEmailRoute(confirmEmailControllerFactory())
  collaborators.webApp.setRouter({
    middlewares: [schemaValidatorMiddleware],
    path: '/identity',
    routes: [sut]
  })

  return { sut, ...collaborators }
}

describe('ChangePasswordRoute', () => {
  beforeAll(async () => {
    await persistence.actual.client.connect()
  })

  afterAll(async () => {
    await persistence.actual.client.clearDatabase()
    await persistence.actual.client.close()
  })

  describe('success', () => {
    it('returns 200 with correct message on success on success', async () => {
      const { userFixture, webApp } = await makeSut()
      const token = 'a.b.c'
      await userFixture.createFixture({
        emailConfirmed: false,
        token
      })

      const { body, statusCode } = await request(webApp.app)
        .post(`/api/identity/confirm-email/${token}`)
        .send()

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        message: 'email confirmed successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 422 with schema error message when schema is invalid', async () => {
      const { webApp } = await makeSut()
      const token = 'invalid_token'

      const { body, statusCode } = await request(webApp.app)
        .post(`/api/identity/confirm-email/${token}`)
        .send({})

      expect(statusCode).toBe(422)
      expect(body).toEqual({
        error: {
          instancePath: '/token',
          keyword: 'pattern',
          message: 'must match pattern "^[\\w-]+\\.[\\w-]+\\.[\\w-]+$"',
          params: { pattern: '^[\\w-]+\\.[\\w-]+\\.[\\w-]+$' },
          schemaPath: '#/properties/token/pattern'
        }
      })
    })

    it('returns 400 with not found error message when token is not found', async () => {
      const { webApp } = await makeSut()
      const token = 'x.y.z'

      const { body, statusCode } = await request(webApp.app)
        .post(`/api/identity/confirm-email/${token}`)
        .send()

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: {
          field: 'token',
          input: 'x.y.z',
          message: "token 'x.y.z' not found"
        }
      })
    })
  })
})
