import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'
import { SendEmailValidationEmailUseCase } from '@/communication/1.application/use-cases/send-email-validation-email-use-case'
import { communication } from '@/core/4.main/container'

export const setCommunicationHandlers = (): void => {
  const { emailSender } = communication
  const sendEmailValidationEmailUseCase = new SendEmailValidationEmailUseCase({ emailSender })

  new UserCreatedHandler({ sendEmailValidationEmailUseCase })
}
