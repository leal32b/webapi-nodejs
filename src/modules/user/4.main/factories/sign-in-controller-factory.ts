import { cryptography, persistence } from '@/core/4.main/container/index'
import { AuthenticateUserUseCase } from '@/user/1.application/use-cases/authenticate-user-use-case'
import { SignInController } from '@/user/2.presentation/controllers/sign-in-controller'

export const signInControllerFactory = (): SignInController => {
  const { userRepository } = persistence.actual.repositories
  const { hasher, encrypter } = cryptography
  const authenticateUserUseCase = new AuthenticateUserUseCase({
    encrypter,
    hasher,
    userRepository
  })

  return new SignInController({ authenticateUserUseCase })
}
