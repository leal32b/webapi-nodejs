import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'
import { SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email-use-case'
import { communication, compilers } from '@/core/4.main/container/index'

export const setCommunicationHandlers = (): void => {
  const { emailSender } = communication
  const { templateCompiler } = compilers
  const sendEmailConfirmationEmailUseCase = SendEmailConfirmationEmailUseCase.create({
    emailSender,
    templateCompiler
  })

  UserCreatedHandler.create({ sendEmailConfirmationEmailUseCase })
}
