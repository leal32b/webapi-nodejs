import nodemailer from 'nodemailer'

import { type EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either, left, right } from '@/core/0.domain/utils/either'
import { ServerError } from '@/core/2.presentation/errors/server-error'

export class NodemailerAdapter implements EmailSender {
  private constructor () {}

  public static create (): NodemailerAdapter {
    return new NodemailerAdapter()
  }

  public async send (email: EmailEntity): Promise<Either<DomainError, void>> {
    try {
      const transporter = this.createTransporter()
      const info = await transporter.sendMail({
        from: email.from.value,
        html: email.html.value,
        subject: email.subject.value,
        to: email.to.value
      })
      console.info(`Email sent: ${info.messageId as string}`)

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
