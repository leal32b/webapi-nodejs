import { type DomainError } from '@/common/0.domain/base/domain-error'
import { Handler } from '@/common/0.domain/base/handler'
import { type Either } from '@/common/0.domain/utils/either'

import { type SendEmailConfirmationEmailResultDTO, type SendEmailConfirmationEmailUseCase } from '@/communication/1.application/use-cases/send-email-confirmation-email-use-case'
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

    const result = await sendEmailConfirmationEmailUseCase.execute({
      locale,
      recipientEmail,
      token
    })

    return result
  }
}
