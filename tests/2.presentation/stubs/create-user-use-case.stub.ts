import User from '@/0.domain/entities/user'
import UseCase from '@/1.application/interfaces/use-case'

export const makeCreateUserUseCaseStub = (): UseCase<null, User> => {
  class CreateUserUseCaseStub implements UseCase<null, User> {
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

  return new CreateUserUseCaseStub()
}
