import { type HandlerFn } from '@/common/1.application/events/message-broker'
import { communication, compilation } from '@/common/4.main/container'

import { UserSendEmailConfirmationHandler } from '@/communication/1.application/handlers/user-send-email-confirmation.handler'
import { SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email.use-case'

export const userSendEmailConfirmationHandlerFactory = (): HandlerFn => {
  const { emailSender } = communication
  const { templateCompiler } = compilation
  const sendEmailConfirmationEmailUseCase = SendEmailConfirmationEmailUseCase.create({
    emailSender,
    templateCompiler
  })

  const userSendEmailConfirmationHandler = UserSendEmailConfirmationHandler.create({ sendEmailConfirmationEmailUseCase })

  return userSendEmailConfirmationHandler.handle.bind(userSendEmailConfirmationHandler)
}
