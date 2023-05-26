import { cryptography, persistence } from '@/common/4.main/container'

import { SignInUserUseCase } from '@/identity/1.application/use-cases/sign-in-user-use-case'
import { SignInController } from '@/identity/2.presentation/controllers/sign-in-controller'

export const signInControllerFactory = (): SignInController => {
  const { userRepository } = persistence.actual.repositories
  const { hasher, encrypter } = cryptography
  const signInUserUseCase = SignInUserUseCase.create({
    encrypter,
    hasher,
    userRepository
  })

  return SignInController.create({ signInUserUseCase })
}
