import { cryptography, persistence } from '@/common/4.main/container'

import { SignInUseCase } from '@/identity/1.application/use-cases/sign-in-use-case'
import { SignInController } from '@/identity/2.presentation/controllers/sign-in-controller'

export const signInControllerFactory = (): SignInController => {
  const { userRepository } = persistence.actual.repositories
  const { hasher, encrypter } = cryptography
  const signInUseCase = SignInUseCase.create({
    encrypter,
    hasher,
    userRepository
  })

  return SignInController.create({ signInUseCase })
}
