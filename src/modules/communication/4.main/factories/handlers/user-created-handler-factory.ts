import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'
import { SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email-use-case'
import { type HandlerFn } from '@/core/3.infra/events/message-broker'
import { communication, compilers } from '@/core/4.main/container'

export const userCreatedHandlerFactory = (): HandlerFn => {
  const { emailSender } = communication
  const { templateCompiler } = compilers
  const sendEmailConfirmationEmailUseCase = SendEmailConfirmationEmailUseCase.create({
    emailSender,
    templateCompiler
  })

  const userCreatedHandler = UserCreatedHandler.create({ sendEmailConfirmationEmailUseCase })

  return userCreatedHandler.handle.bind(userCreatedHandler)
}
