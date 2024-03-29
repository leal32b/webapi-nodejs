import { type DomainError } from '@/common/0.domain/base/domain-error'
import { Handler } from '@/common/0.domain/base/handler'
import { type Either } from '@/common/0.domain/utils/either'

import { type SendEmailConfirmationResultDTO, type SendEmailConfirmationUseCase } from '@/communication/1.application/use-cases/send-email-confirmation.use-case'
import { type UserCreatedEvent } from '@/identity/0.domain/events/user-created.event'

type Props = {
  sendEmailConfirmationUseCase: SendEmailConfirmationUseCase
}

export class UserSendEmailConfirmationHandler extends Handler<Props> {
  public static create (props: Props): UserSendEmailConfirmationHandler {
    return new UserSendEmailConfirmationHandler(props)
  }

  public async handle (event: UserCreatedEvent): Promise<Either<DomainError[], SendEmailConfirmationResultDTO>> {
    const { sendEmailConfirmationUseCase } = this.props
    const { email: recipientEmail, locale, token } = event.payload

    const result = await sendEmailConfirmationUseCase.execute({
      locale,
      recipientEmail,
      token
    })

    return result
  }
}
