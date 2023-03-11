import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'
import { SendEmailValidationEmailUseCase } from '@/communication/1.application/use-cases/send-email-validation-email-use-case'
import { communication } from '@/core/4.main/container/index'

export const setCommunicationHandlers = (): void => {
  const { emailSender } = communication
  const sendEmailValidationEmailUseCase = SendEmailValidationEmailUseCase.create({ emailSender })

  UserCreatedHandler.create({ sendEmailValidationEmailUseCase })
}
