import { type SendEmailConfirmationEmailResultDTO, type SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email-use-case'
import { type DomainError } from '@/core/0.domain/base/domain-error'
import { Handler } from '@/core/0.domain/base/handler'
import { type Either } from '@/core/0.domain/utils/either'
import { type UserCreatedEvent } from '@/user/0.domain/events/user-created-event'

type Props = {
  sendEmailConfirmationEmailUseCase: SendEmailConfirmationEmailUseCase
}

export class UserCreatedHandler extends Handler<Props> {
  public static create (props: Props): UserCreatedHandler {
    return new UserCreatedHandler(props)
  }

  public async handle (event: UserCreatedEvent): Promise<Either<DomainError[], SendEmailConfirmationEmailResultDTO>> {
    const { sendEmailConfirmationEmailUseCase } = this.props
    const { email: recipientEmail, locale, token } = event.payload

    return await sendEmailConfirmationEmailUseCase.execute({
      locale,
      recipientEmail,
      token
    })
  }
}
