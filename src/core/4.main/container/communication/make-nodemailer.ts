import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { NodemailerAdapter } from '@/core/3.infra/communication/email/nodemailer/nodemailer-adapter'

export const makeNodemailer: EmailSender = NodemailerAdapter.create()
