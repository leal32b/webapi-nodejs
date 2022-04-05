import User from '@/0.domain/entities/user'
import ReadUserByEmailRepository from '@/1.application/interfaces/read-user-by-email-repository'

export const makeReadUserByEmailRepositoryStub = (): ReadUserByEmailRepository => {
  class ReadUserByEmailRepositoryStub implements ReadUserByEmailRepository {
    async read (email: string): Promise<User> {
      const fakeUser = {
        id: 'any_id',
        name: 'any_name',
        email,
        password: 'hashed_password'
      }

      return new User(fakeUser)
    }
  }

  return new ReadUserByEmailRepositoryStub()
}
