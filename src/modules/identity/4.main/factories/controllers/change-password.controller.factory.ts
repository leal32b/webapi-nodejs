import { cryptography, persistence } from '@/common/4.main/container'

import { ChangePasswordUseCase } from '@/identity/1.application/use-cases/change-password.use-case'
import { ChangePasswordController } from '@/identity/2.presentation/controllers/change-password.controller'

export const changePasswordControllerFactory = (): ChangePasswordController => {
  const { userRepository } = persistence.actual.repositories
  const { hasher } = cryptography
  const changePasswordUseCase = ChangePasswordUseCase.create({
    hasher,
    userRepository
  })

  return ChangePasswordController.create({ changePasswordUseCase })
}
