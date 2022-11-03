import { SendEmailValidationEmailUseCase } from '@/communication/1.application/use-cases/send-email-validation-email-use-case'
import { Handler } from '@/core/0.domain/base/handler'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'

type ConstructParams = {
  sendEmailValidationEmailUseCase: SendEmailValidationEmailUseCase
}
export class UserCreatedHandler extends Handler<ConstructParams> {
  public static create (params: ConstructParams): UserCreatedHandler {
    const userCreatedHandler = new UserCreatedHandler(params)
    userCreatedHandler.setupSubscriptions(UserCreatedEvent.name, userCreatedHandler.onUserCreatedEvent.bind(userCreatedHandler))

    return userCreatedHandler
  }

  private async onUserCreatedEvent (event: UserCreatedEvent): Promise<void> {
    const { sendEmailValidationEmailUseCase } = this.props
    const { email: recipientEmail, token } = event.payload

    await sendEmailValidationEmailUseCase.execute({ recipientEmail, token })
  }
}
