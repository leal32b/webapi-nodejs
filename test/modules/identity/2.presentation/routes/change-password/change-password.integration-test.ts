import request from 'supertest'

import { Identifier } from '@/common/0.domain/utils/identifier'
import { TokenType } from '@/common/1.application/cryptography/encrypter'
import { type PersistenceFixture } from '@/common/3.infra/persistence/persistence.fixture'
import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { app, cryptography, persistence } from '@/common/4.main/container'
import { setupWebApp } from '@/common/4.main/setup/webapp'

import { type UserEntityProps } from '@/identity/0.domain/entities/user.entity'

import { identityFixtures } from '~/identity/_fixtures/identity-fixtures'

const makeAccessTokenFake = async (): Promise<string> => {
  const token = await cryptography.encrypter.encrypt({
    payload: {
      auth: ['user'],
      id: 'any_id'
    },
    type: TokenType.access
  })

  return `Bearer ${token.value as string}`
}

type SutTypes = {
  userFixture: PersistenceFixture<UserEntityProps>
  accessTokenFake: string
  webApp: WebApp
}

const makeSut = async (): Promise<SutTypes> => {
  const collaborators = {
    userFixture: identityFixtures.userFixture,
    webApp: app.webApp
  }
  const doubles = {
    accessTokenFake: await makeAccessTokenFake()
  }
  setupWebApp(app.webApp)

  return {
    ...collaborators,
    ...doubles
  }
}

describe('ChangePasswordRoute', () => {
  beforeAll(async () => {
    await persistence.actual.client.connect()
  })

  afterEach(async () => {
    await persistence.postgres.client.clearDatabase()
  })

  describe('success', () => {
    it('returns 200 with correct message on success', async () => {
      const { userFixture, webApp, accessTokenFake } = await makeSut()
      const id = Identifier.create().value
      const password = 'any_password'
      const hashedPassword = (await cryptography.hasher.hash(password)).value as string
      await userFixture.createFixture({ id, password: hashedPassword })

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/user/change-password')
        .set('Authorization', accessTokenFake)
        .send({
          id,
          password: 'new_password',
          passwordRetype: 'new_password'
        })

      expect(statusCode).toBe(200)
      expect(body).toEqual({
        message: 'password updated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 401 with no Authorization token was provided message when accessToken is missing', async () => {
      const { webApp } = await makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/user/change-password')
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })

      expect(statusCode).toBe(401)
      expect(body).toEqual({
        error: {
          message: 'no Authorization token was provided'
        }
      })
    })

    it('returns 401 with token is invalid (type: Bearer) error message when accessToken is invalid', async () => {
      const { webApp } = await makeSut()
      const accessToken = 'invalid_token'

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/user/change-password')
        .set('Authorization', accessToken)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })

      expect(statusCode).toBe(401)
      expect(body).toEqual({
        error: {
          message: 'token is invalid (type: Bearer)'
        }
      })
    })

    it('returns 422 with schema error message when schema is invalid', async () => {
      const { webApp, accessTokenFake } = await makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/user/change-password')
        .set('Authorization', accessTokenFake)
        .send()

      expect(statusCode).toBe(422)
      expect(body).toEqual({
        error: {
          instancePath: '',
          keyword: 'required',
          message: "must have required property 'id'",
          params: { missingProperty: 'id' },
          schemaPath: '#/required'
        }
      })
    })

    it('returns 401 with passwords should match error message when passwords do not match', async () => {
      const { webApp, accessTokenFake } = await makeSut()

      const { body, statusCode } = await request(webApp.app)
        .post('/api/identity/user/change-password')
        .set('Authorization', accessTokenFake)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })

      expect(statusCode).toBe(401)
      expect(body).toEqual({
        error: {
          field: 'password',
          message: 'passwords should match'
        }
      })
    })
  })
})
