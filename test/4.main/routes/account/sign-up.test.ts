import { MongodbHelper } from '@/3.infra/database/mongodb/helpers/mongodb'
import app from '@/4.main/config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongodbHelper.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    await MongodbHelper.getCollection('accounts').deleteMany({})
  })

  afterAll(async () => {
    await MongodbHelper.close()
  })

  it('should return as account on success', async () => {
    await request(app)
      .post('/api/account/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(200)
  })
})
