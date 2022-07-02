import request from 'supertest'

import { Route } from '@/2.presentation/types/route'
import { MongodbAdapter } from '@/3.infra/persistence/mongodb/adapter/mongodb'
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
    await MongodbAdapter.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    await MongodbAdapter.getCollection('users').deleteMany({})
  })

  afterAll(async () => {
    await MongodbAdapter.close()
  })

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
