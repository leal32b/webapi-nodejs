import UseCase from '@/1.application/interfaces/use-case'

export const makeAuthenticateUserUseCaseStub = (): UseCase<null, string> => {
  class AuthenticateUserUseCaseStub implements UseCase<null, string> {
    async execute (): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticateUserUseCaseStub()
}
