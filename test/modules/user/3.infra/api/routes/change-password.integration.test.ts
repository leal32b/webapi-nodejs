import request from 'supertest'

import { TokenType } from '@/core/1.application/cryptography/encrypter'
import { Route, WebApp } from '@/core/3.infra/api/app/web-app'
import { DatabaseFactory } from '@/core/3.infra/persistence/database-factory'
import { config } from '@/core/4.main/config'
import { factories } from '@/core/4.main/setup/factories'
import { authMiddlewareFactory } from '@/core/4.main/setup/middlewares/auth-middle-factory'
import { schemaValidatorMiddlewareFactory } from '@/core/4.main/setup/middlewares/schema-validator-middleware-factory'
import { UserAggregateCreateParams } from '@/user/0.domain/aggregates/user-aggregate'
import { changePasswordRoute } from '@/user/3.infra/api/routes/change-password-route'
import { changePasswordControllerFactory } from '@/user/4.main/factories/change-password-controller-factory'

const makeAuthorizationFake = async (): Promise<string> => {
  const token = await config.cryptography.encrypter.encrypt({
    type: TokenType.access,
    payload: {
      id: 'any_id',
      auth: ['user']
    }
  })

  return `Bearer ${token.value as string}`
}

type SutTypes = {
  sut: Route
  userFactory: DatabaseFactory<UserAggregateCreateParams>
  webApp: WebApp
  authorizationFake: string
}

const makeSut = async (): Promise<SutTypes> => {
  const doubles = {
    authorizationFake: await makeAuthorizationFake()
  }
  const collaborators = {
    userFactory: factories.userFactory,
    webApp: config.app.webApp
  }
  const sut = changePasswordRoute(changePasswordControllerFactory())
  collaborators.webApp.setRouter({
    path: '/user',
    routes: [sut],
    middlewares: [authMiddlewareFactory(), schemaValidatorMiddlewareFactory()]
  })

  return { sut, ...collaborators, ...doubles }
}

describe('ChangePasswordRoute', () => {
  beforeAll(async () => {
    await config.persistence.connect()
  })

  afterAll(async () => {
    await config.persistence.clear()
    await config.persistence.close()
  })

  describe('success', () => {
    it('returns 200 on success', async () => {
      const { userFactory, webApp, authorizationFake } = await makeSut()
      const id = 'any_id'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await userFactory.createFixture({ id, password: hashedPassword })

      await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', authorizationFake)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'any_password'
        })
        .expect(200)
    })

    it('returns correct message on success', async () => {
      const { userFactory, webApp, authorizationFake } = await makeSut()
      const id = 'any_id2'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await userFactory.createFixture({ id, password: hashedPassword })

      const result = await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', authorizationFake)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'any_password'
        })

      expect(result.body).toEqual({
        message: 'password updated successfully'
      })
    })
  })

  describe('failure', () => {
    it('returns 401 when accessToken is missing', async () => {
      const { webApp } = await makeSut()

      await request(webApp.app)
        .post('/api/user/change-password')
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })
        .expect(401)
    })

    it('returns correct error message when accessToken is missing', async () => {
      const { webApp } = await makeSut()

      const result = await request(webApp.app)
        .post('/api/user/change-password')
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })

      expect(result.body).toEqual({
        error: {
          message: 'no Authorization token was provided'
        }
      })
    })

    it('returns 400 when schema is invalid', async () => {
      const { webApp, authorizationFake } = await makeSut()

      await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', authorizationFake)
        .send({})
        .expect(422)
    })

    it('returns schema error message when schema is invalid', async () => {
      const { webApp, authorizationFake } = await makeSut()

      const result = await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', authorizationFake)
        .send({})

      expect(result.body).toEqual({
        error: {
          instancePath: '',
          keyword: 'required',
          message: "must have required property 'id'",
          params: { missingProperty: 'id' },
          schemaPath: '#/required'
        }
      })
    })

    it('returns 400 when passwords do not match', async () => {
      const { webApp, authorizationFake } = await makeSut()

      await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', authorizationFake)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })
        .expect(400)
    })

    it('returns passwords should match error message', async () => {
      const { webApp, authorizationFake } = await makeSut()

      const result = await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', authorizationFake)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })
        .expect(400)

      expect(result.body).toEqual({
        error: {
          field: 'password',
          message: 'passwords should match'
        }
      })
    })
  })
})
