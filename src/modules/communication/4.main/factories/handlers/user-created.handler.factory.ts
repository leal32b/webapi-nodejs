import { type HandlerFn } from '@/common/1.application/events/message-broker'
import { communication, compilation } from '@/common/4.main/container'

import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created.handler'
import { SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email.use-case'

export const userCreatedHandlerFactory = (): HandlerFn => {
  const { emailSender } = communication
  const { templateCompiler } = compilation
  const sendEmailConfirmationEmailUseCase = SendEmailConfirmationEmailUseCase.create({
    emailSender,
    templateCompiler
  })

  const userCreatedHandler = UserCreatedHandler.create({ sendEmailConfirmationEmailUseCase })

  return userCreatedHandler.handle.bind(userCreatedHandler)
}
