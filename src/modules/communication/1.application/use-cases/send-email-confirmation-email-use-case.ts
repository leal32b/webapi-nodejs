import path from 'path'

import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { getVar } from '@/core/0.domain/utils/var'
import { UseCase } from '@/core/1.application/base/use-case'
import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'

type Props = {
  emailSender: EmailSender
  templateCompiler: TemplateCompiler
}

export type SendEmailConfirmationEmailData = {
  locale: string
  recipientEmail: string
  token: string
}

export type SendEmailConfirmationEmailResultDTO = {
  message: string
}

export class SendEmailConfirmationEmailUseCase extends UseCase<Props, SendEmailConfirmationEmailData, SendEmailConfirmationEmailResultDTO> {
  public static create (props: Props): SendEmailConfirmationEmailUseCase {
    return new SendEmailConfirmationEmailUseCase(props)
  }

  public async execute (sendEmailConfirmationEmailData: SendEmailConfirmationEmailData): Promise<Either<DomainError[], SendEmailConfirmationEmailResultDTO>> {
    const { emailSender, templateCompiler } = this.props
    const { locale, recipientEmail, token } = sendEmailConfirmationEmailData

    const htmlOrError = templateCompiler.compile(path.join(__dirname, '../templates/email-confirmation'), {
      link: `${getVar('SERVER_BASE_URL')}/user/confirm-email/${token}`,
      lng: locale
    })

    if (htmlOrError.isLeft()) {
      return left([htmlOrError.value])
    }

    const html = htmlOrError.value
    const emailEntityOrError = EmailEntity.create({
      from: 'from@mail.com',
      html,
      subject: 'Validate e-mail',
      to: recipientEmail
    })

    if (emailEntityOrError.isLeft()) {
      return left(emailEntityOrError.value)
    }

    const emailEntity = emailEntityOrError.value
    const result = await emailSender.send(emailEntity)

    if (result.isLeft()) {
      return left([result.value])
    }

    return right({ message: 'e-mail confirmation e-mail sent successfully' })
  }
}
