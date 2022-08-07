import request from 'supertest'

import { TokenType } from '@/core/1.application/cryptography/encrypter'
import { Middleware } from '@/core/2.presentation/middleware/middleware'
import { Route, WebApp } from '@/core/3.infra/api/app/web-app'
import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/core/3.infra/persistence/postgres/data-sources/test'
import { config } from '@/core/4.main/config/config'
import { authMiddlewareFactory } from '@/core/4.main/factories/auth-middle-factory'
import { changePasswordRoute } from '@/modules/user/3.infra/api/routes/change-password-route'
import { PgUserFactory } from '@/modules/user/3.infra/persistence/postgres/factories/user-factory'
import { changePasswordControllerFactory } from '@/modules/user/4.main/factories/change-password-controller-factory'

const makeFakeAuthorization = async (): Promise<string> => {
  const token = await config.cryptography.encrypter.encrypt({ type: TokenType.access })

  return `Bearer ${token.value as string}`
}

type SutTypes = {
  sut: Route
  pgUserFactory: PgUserFactory
  webApp: WebApp
  authMiddleware: Middleware
  fakeAuthorization: string
}

const makeSut = async (): Promise<SutTypes> => {
  const fakes = {
    fakeAuthorization: await makeFakeAuthorization()
  }
  const collaborators = {
    pgUserFactory: PgUserFactory.create(),
    webApp: config.app.webApp,
    authMiddleware: authMiddlewareFactory()
  }
  const sut = changePasswordRoute(changePasswordControllerFactory(), collaborators.authMiddleware)

  return { sut, ...collaborators, ...fakes }
}

describe('ChangePasswordRoute', () => {
  beforeAll(async () => {
    await pg.connect(testDataSource)
  })

  afterAll(async () => {
    await pg.client.clearDatabase()
    await pg.client.close()
  })

  describe('success', () => {
    it('returns 200 on success', async () => {
      const { sut, pgUserFactory, webApp, fakeAuthorization } = await makeSut()
      const id = 'any_id'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await pgUserFactory.createFixtures({ id, password: hashedPassword })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', fakeAuthorization)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'any_password'
        })
        .expect(200)
    })

    it('returns correct message on success', async () => {
      const { sut, pgUserFactory, webApp, fakeAuthorization } = await makeSut()
      const id = 'any_id2'
      const password = 'any_password'
      const hashedPassword = (await config.cryptography.hasher.hash(password)).value as string
      await pgUserFactory.createFixtures({ id, password: hashedPassword })
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', fakeAuthorization)
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
    it('returns 400 when passwords do not match', async () => {
      const { sut, webApp, fakeAuthorization } = await makeSut()
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', fakeAuthorization)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })
        .expect(400)
    })

    it('returns passwords should match error message', async () => {
      const { sut, webApp, fakeAuthorization } = await makeSut()
      webApp.setRouter({
        path: '/user',
        routes: [sut]
      })

      const result = await request(webApp.app)
        .post('/api/user/change-password')
        .set('Authorization', fakeAuthorization)
        .send({
          id: 'any_id',
          password: 'any_password',
          passwordRetype: 'another_password'
        })
        .expect(400)

      expect(result.body).toEqual([{
        props: {
          field: 'password',
          message: 'passwords should match'
        }
      }])
    })
  })
})
