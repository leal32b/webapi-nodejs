import app from '@/4.main/config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
  it('should return as account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(200)
  })
})
