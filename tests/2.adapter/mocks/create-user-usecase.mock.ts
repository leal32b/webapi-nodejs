import User from '@/0.domain/entities/user'
import CreateUser from '@/0.domain/interfaces/create-user'

export default class CreateUserUsecaseStub implements CreateUser {
  async execute (): Promise<User> {
    const fakeUser = new User({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    return await Promise.resolve(fakeUser)
  }
}
