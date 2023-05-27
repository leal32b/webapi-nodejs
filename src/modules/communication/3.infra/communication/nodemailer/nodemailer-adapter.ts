import nodemailer from 'nodemailer'

import { type DomainError } from '@/common/0.domain/base/domain-error'
import { type Either, left, right } from '@/common/0.domain/utils/either'
import { type Logger } from '@/common/1.application/logging/logger'
import { ServerError } from '@/common/2.presentation/errors/server-error'

import { type EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'

type Props = {
  logger: Logger
}

export class NodemailerAdapter implements EmailSender {
  private constructor (private readonly props: Props) {}

  public static create (props: Props): NodemailerAdapter {
    return new NodemailerAdapter(props)
  }

  public async send (email: EmailEntity): Promise<Either<DomainError, void>> {
    const { logger } = this.props

    try {
      const transporter = this.createTransporter()
      const info = await transporter.sendMail({
        from: email.from.value,
        html: email.html.value,
        subject: email.subject.value,
        to: email.to.value
      })

      logger.info('communication', `Email sent: ${info.messageId as string}`)

      return right()
    } catch (error) {
      return left(ServerError.create(error.message, error.stack))
    }
  }

  private createTransporter (): nodemailer.Transporter {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env

    const transporter = nodemailer.createTransport({
      auth: {
        pass: EMAIL_PASSWORD,
        user: EMAIL_USERNAME
      },
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT)
    })

    return transporter
  }
}
