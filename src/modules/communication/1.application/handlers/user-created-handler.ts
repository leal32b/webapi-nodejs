import { SendEmailValidationEmailUseCase } from '@/communication/1.application/use-cases/send-email-validation-email-use-case'
import { Handler } from '@/core/0.domain/base/handler'
import { DomainEvents } from '@/core/0.domain/events/domain-events'
import { UserCreatedEvent } from '@/user/0.domain/events/user-created-event'

type ConstructParams = {
  sendEmailValidationEmailUseCase: SendEmailValidationEmailUseCase
}
export class UserCreatedHandler extends Handler {
  constructor (private readonly props: ConstructParams) {
    super()
    this.setupSubscriptions()
  }

  setupSubscriptions (): void {
    DomainEvents.register(this.onUserCreatedEvent.bind(this), UserCreatedEvent.name)
  }

  private async onUserCreatedEvent (event: UserCreatedEvent): Promise<void> {
    const { sendEmailValidationEmailUseCase } = this.props
    const { email: recipientEmail, token } = event.payload

    await sendEmailValidationEmailUseCase.execute({ recipientEmail, token })
  }
}
