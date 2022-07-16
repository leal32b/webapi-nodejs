import request from 'supertest'

import { Route } from '@/2.presentation/types/route'
import pg from '@/3.infra/persistence/postgres/client/pg-client'
import { testDataSource } from '@/3.infra/persistence/postgres/data-sources/test'
import ExpressApp from '@/3.infra/web/express/app/express'
import signUpRoute from '@/4.main/routes/user/sign-up'

type SutTypes = {
  sut: Route
  expressApp: ExpressApp
}

const makeSut = (): SutTypes => {
  const collaborators = {
    expressApp: new ExpressApp()
  }
  const sut = signUpRoute()

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
    it('returns an user on success', async () => {
      const { sut, expressApp } = makeSut()
      expressApp.setRoute(sut)

      await request(expressApp.app)
        .post('/sign-up')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordRetype: 'any_password'
        })
        .expect(200)
    })
  })
})
