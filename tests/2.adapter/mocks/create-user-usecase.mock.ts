import User from '@/0.domain/entities/user'
import Usecase from '@/1.application/interfaces/usecase'

export const makeCreateUserUsecaseStub = (): Usecase<null, User> => {
  class CreateUserUsecaseStub implements Usecase<null, User> {
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

  return new CreateUserUsecaseStub()
}
