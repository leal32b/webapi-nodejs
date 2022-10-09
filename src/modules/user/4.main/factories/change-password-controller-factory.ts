import { config } from '@/core/4.main/config/config'
import { ChangePasswordUseCase } from '@/user/1.application/use-cases/change-password-use-case'
import { ChangePasswordController } from '@/user/2.presentation/controllers/change-password-controller'

export const changePasswordControllerFactory = (): ChangePasswordController => {
  const { userRepository } = config.persistence.repositories
  const { hasher } = config.cryptography
  const changePasswordUseCase = new ChangePasswordUseCase({ userRepository, hasher })

  return new ChangePasswordController({ changePasswordUseCase })
}
