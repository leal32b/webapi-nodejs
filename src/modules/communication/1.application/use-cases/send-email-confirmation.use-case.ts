import path from 'path'

import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { getVar } from '@/common/0.domain/utils/var'
import { UseCase } from '@/common/1.application/base/use-case'
import { type TemplateCompiler } from '@/common/1.application/compilation/template-compiler'

import { EmailEntity } from '@/communication/0.domain/entities/email.entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'

type Props = {
  emailSender: EmailSender
  templateCompiler: TemplateCompiler
}

export type SendEmailConfirmationData = {
  locale: string
  recipientEmail: string
  token: string
}

export type SendEmailConfirmationResultDTO = {
  message: string
}

export class SendEmailConfirmationUseCase extends UseCase<Props, SendEmailConfirmationData, SendEmailConfirmationResultDTO> {
  public static create (props: Props): SendEmailConfirmationUseCase {
    return new SendEmailConfirmationUseCase(props)
  }

  public async execute (sendEmailConfirmationData: SendEmailConfirmationData): Promise<Either<DomainError[], SendEmailConfirmationResultDTO>> {
    const { emailSender, templateCompiler } = this.props
    const { locale, recipientEmail, token } = sendEmailConfirmationData

    const htmlOrError = templateCompiler.compile(path.join(__dirname, '../templates/email-confirmation'), {
      link: `${getVar('SERVER_BASE_URL')}/identity/user/confirm-email/${token}`,
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
    const successOrError = await emailSender.send(emailEntity)

    if (successOrError.isLeft()) {
      return left([successOrError.value])
    }

    return right({ message: 'e-mail confirmation e-mail sent successfully' })
  }
}
