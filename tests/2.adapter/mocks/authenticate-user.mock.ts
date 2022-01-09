import Usecase from '@/1.application/interfaces/usecase'

export default class AuthenticateUserUsecaseStub implements Usecase<null, string> {
  async execute (): Promise<string> {
    return 'any_token'
  }
}
