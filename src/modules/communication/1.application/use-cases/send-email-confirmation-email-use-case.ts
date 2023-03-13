import path from 'path'

import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { UseCase } from '@/core/1.application/base/use-case'
import { type TemplateCompiler } from '@/core/1.application/compilers/template-compiler'

type Props = {
  emailSender: EmailSender
  templateCompiler: TemplateCompiler
}

export type SendEmailValidationEmailData = {
  recipientEmail: string
  token: string
}

export type SendEmailValidationEmailResultDTO = {
  message: string
}

export class SendEmailConfirmationEmailUseCase extends UseCase<Props, SendEmailValidationEmailData, SendEmailValidationEmailResultDTO> {
  public static create (props: Props): SendEmailConfirmationEmailUseCase {
    return new SendEmailConfirmationEmailUseCase(props)
  }

  public async execute (sendEmailValidationEmailData: SendEmailValidationEmailData): Promise<Either<DomainError[], SendEmailValidationEmailResultDTO>> {
    const { emailSender, templateCompiler } = this.props
    const { recipientEmail, token } = sendEmailValidationEmailData

    const htmlOrError = templateCompiler.compile(path.join(__dirname, '../templates/email-confirmation'), { token })

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
