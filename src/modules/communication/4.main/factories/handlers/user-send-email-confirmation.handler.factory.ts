import { type HandlerFn } from '@/common/1.application/events/message-broker'
import { communication, compilation } from '@/common/4.main/container'

import { UserSendEmailConfirmationHandler } from '@/communication/1.application/handlers/user-send-email-confirmation.handler'
import { SendEmailConfirmationUseCase } from '@/communication/1.application/use-cases/send-email-confirmation.use-case'

export const userSendEmailConfirmationHandlerFactory = (): HandlerFn => {
  const { emailSender } = communication
  const { templateCompiler } = compilation
  const sendEmailConfirmationUseCase = SendEmailConfirmationUseCase.create({
    emailSender,
    templateCompiler
  })

  const userSendEmailConfirmationHandler = UserSendEmailConfirmationHandler.create({ sendEmailConfirmationUseCase })

  return userSendEmailConfirmationHandler.handle.bind(userSendEmailConfirmationHandler)
}
