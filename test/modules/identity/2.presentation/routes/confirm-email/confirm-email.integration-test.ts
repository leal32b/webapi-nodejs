import request from 'supertest'

import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { app, persistence } from '@/common/4.main/container'
import { setupWebApp } from '@/common/4.main/setup/webapp'

import { type UserEntityProps } from '@/identity/0.domain/entities/user.entity'

import { identityFixtures } from '~/identity/_fixtures/identity-fixtures'

type SutTypes = {
  userFixture: PersistenceFixture<UserEntityProps>
  webApp: WebApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    userFixture: identityFixtures.userFixture,
    webApp: app.webApp
  }
  setupWebApp(app.webApp)

  return { ...collaborators }
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
    it('returns 200 with correct message on success', async () => {
      const { userFixture, webApp } = await makeSut()
      const token = 'a.b.c'
      await userFixture.createFixture({
        emailConfirmed: false,
        token
      })

      const { body, statusCode } = await request(webApp.app)
        .patch(`/api/identity/user/confirm-email/${token}`)
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
        .patch(`/api/identity/user/confirm-email/${token}`)
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
        .patch(`/api/identity/user/confirm-email/${token}`)
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
