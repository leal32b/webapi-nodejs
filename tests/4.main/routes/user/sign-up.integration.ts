import request from 'supertest'

// import { MongodbAdapter } from '@/3.infra/databases/mongodb/adapter/mongodb'
import { PostgresAdapter } from '@/3.infra/databases/postgres/adapter/postgres'
import app from '@/4.main/config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    // await MongodbAdapter.connect(global.__MONGO_URI__)
    await PostgresAdapter.connect('test')
  })

  beforeEach(async () => {
    // await MongodbAdapter.getCollection('users').deleteMany({})
  })

  afterAll(async () => {
    // await MongodbAdapter.close()
    await PostgresAdapter.postgresClient.dropDatabase()
    await PostgresAdapter.close()
  })

  it('should return an user on success', async () => {
    await request(app)
      .post('/api/user/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(200)
  })
})
