import AuthenticateUserUseCase from '@/1.application/use-cases/authenticate-user-use-case'
import SignInController from '@/2.presentation/controllers/sign-in-controller'
import { config } from '@/4.main/config/config'

export default (): SignInController => {
  const { userRepository } = config.persistence
  const { hasher, encrypter } = config.cryptography
  const authenticateUserUseCase = new AuthenticateUserUseCase({ userRepository, hasher, encrypter })

  return new SignInController({ authenticateUserUseCase })
}
