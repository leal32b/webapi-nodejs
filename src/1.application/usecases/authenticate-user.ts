import Usecase from '@/1.application/interfaces/usecase'
import { AuthenticationData } from '@/1.application/types/user-types'

export default class AuthenticateUserUsecase implements Usecase<AuthenticationData, string> {
  async execute (authenticationData: AuthenticationData): Promise<string> {
    return 'temp'
  }
}
