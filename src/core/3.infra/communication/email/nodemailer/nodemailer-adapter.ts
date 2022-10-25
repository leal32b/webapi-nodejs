import nodemailer from 'nodemailer'

import { EmailEntity } from '@/communication/0.domain/entities/email-entity'
import { EmailSender } from '@/communication/1.application/email/email-sender'
import { DomainError } from '@/core/0.domain/base/domain-error'
import { Either, left, right } from '@/core/0.domain/utils/either'
import { ServerError } from '@/core/2.presentation/errors/server-error'

export class NodemailerAdapter implements EmailSender {
  async send (email: EmailEntity): Promise<Either<DomainError, void>> {
    try {
      const transporter = this.createTransporter()
      const info = await transporter.sendMail({
        from: email.from.value,
        to: email.to.value,
        subject: email.subject.value,
        text: email.text.value
      })

      console.log(`Email sent: ${info.messageId as string}`)

      return right()
    } catch (error) {
      return left(new ServerError(error.message, error.stack))
    }
  }

  private createTransporter (): nodemailer.Transporter {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT),
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      }
    })

    return transporter
  }
}
