import { cryptography, persistence } from '@/core/4.main/container/index'
import { ChangePasswordUseCase } from '@/user/1.application/use-cases/change-password-use-case'
import { ChangePasswordController } from '@/user/2.presentation/controllers/change-password-controller'

export const changePasswordControllerFactory = (): ChangePasswordController => {
  const { userRepository } = persistence.actual.repositories
  const { hasher } = cryptography
  const changePasswordUseCase = new ChangePasswordUseCase({ userRepository, hasher })

  return new ChangePasswordController({ changePasswordUseCase })
}
