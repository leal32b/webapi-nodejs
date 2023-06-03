import request from 'supertest'

import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence-fixture'
import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { app, persistence } from '@/common/4.main/container'
import { setupWebApp } from '@/common/4.main/setup/webapp'

import { type UserAggregateProps } from '@/identity/0.domain/aggregates/user-aggregate'

import { userFixtures } from '~/identity/_fixtures/user-fixtures'

type SutTypes = {
  userFixture: PersistenceFixture<UserAggregateProps>
  webApp: WebApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    userFixture: userFixtures.userFixture,
    webApp: app.webApp
  }
  setupWebApp(app.webApp)

  return { ...collaborators }
}

describe('SignUpRoute', () => {
  beforeAll(async () => {
    await persistence.actual.client.connect()
  })

  afterAll(async () => {
    await persistence.actual.client.clearDatabase()
    await persistence.actual.client.close()
  })

  describe('success', () => {
    it('returns 200 with an email on success', async () => {
      const { webApp } = makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/sign-up')
        .send({
          email: 'any@mail.com',
          locale: 'en',
          name: 'any_name',
          password: 'any_password',
          passwordRetype: 'any_password'
        })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        email: expect.any(String),
        message: 'user signed up successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 422 with schema error message when schema is invalid', async () => {
      const { webApp } = makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/sign-up')
        .send()

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

    it('returns 400 with password should match error message when passwords do not match', async () => {
      const { webApp } = makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/sign-up')
        .send({
          email: 'any@mail.com',
          locale: 'en',
          name: 'any_name',
          password: 'any_password',
          passwordRetype: 'another_password'
        })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: {
          field: 'password',
          message: 'passwords should match'
        }
      })
    })

    it('returns 400 with email already in use error message when email is already in use', async () => {
      const { userFixture, webApp } = makeSut()
      const email = 'any2@mail.com'
      await userFixture.createFixture({ email })

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/sign-up')
        .send({
          email: 'any2@mail.com',
          locale: 'en',
          name: 'any_name',
          password: 'any_password',
          passwordRetype: 'any_password'
        })

      expect(statusCode).toBe(400)
      expect(body).toEqual({
        error: {
          field: 'email',
          input: 'any2@mail.com',
          message: 'email already in use'
        }
      })
    })
  })
})
