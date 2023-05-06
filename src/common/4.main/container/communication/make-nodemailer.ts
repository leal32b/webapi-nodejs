import { logging } from '@/common/4.main/container/logging'

import { type EmailSender } from '@/communication/1.application/email/email-sender'
import { NodemailerAdapter } from '@/communication/3.infra/communication/nodemailer/nodemailer-adapter'

export const makeNodemailer: EmailSender = NodemailerAdapter.create({ logger: logging.logger })
