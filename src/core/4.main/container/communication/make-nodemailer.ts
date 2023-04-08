import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { NodemailerAdapter } from '@/communication/3.infra/communication/nodemailer/nodemailer-adapter'
import { logging } from '@/core/4.main/container/logging'

export const makeNodemailer: EmailSender = NodemailerAdapter.create({ logger: logging.logger })
