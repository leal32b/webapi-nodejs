import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { EmailSender } from '@/communication/1.application/email/email-sender'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { UseCase } from '@/core/1.application/base/use-case'

export type ConstructParams = {
  emailSender: EmailSender
}

export type SendEmailValidationEmailData = {
  recipientEmail: string
  token: string
}

export type SendEmailValidationEmailResultDTO = {
  message: string
}

export class SendEmailValidationEmailUseCase extends UseCase<ConstructParams, SendEmailValidationEmailData, SendEmailValidationEmailResultDTO> {
  public static create (props: ConstructParams): SendEmailValidationEmailUseCase {
    return new SendEmailValidationEmailUseCase(props)
  }

  public async execute (sendEmailValidationEmailData: SendEmailValidationEmailData): Promise<Either<DomainError[], SendEmailValidationEmailResultDTO>> {
    const { emailSender } = this.props
    const { recipientEmail, token } = sendEmailValidationEmailData

    const emailEntityOrError = EmailEntity.create({
      from: 'from@mail.com',
      html: `<html>token: ${token}</html>`,
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

    return right({ message: 'e-mail validation e-mail sent successfully' })
  }
}
