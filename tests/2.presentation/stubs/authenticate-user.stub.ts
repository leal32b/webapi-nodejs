import Usecase from '@/1.application/interfaces/usecase'

export const makeAuthenticateUserUsecaseStub = (): Usecase<null, string> => {
  class AuthenticateUserUsecaseStub implements Usecase<null, string> {
    async execute (): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticateUserUsecaseStub()
}
