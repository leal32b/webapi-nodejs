import { persistence } from '@/common/4.main/container'

import { ConfirmEmailUseCase } from '@/identity/1.application/use-cases/confirm-email-use-case'
import { ConfirmEmailController } from '@/identity/2.presentation/controllers/confirm-email-controller'

export const confirmEmailControllerFactory = (): ConfirmEmailController => {
  const { userRepository } = persistence.actual.repositories
  const confirmEmailUseCase = ConfirmEmailUseCase.create({
    userRepository
  })

  return ConfirmEmailController.create({ confirmEmailUseCase })
}
