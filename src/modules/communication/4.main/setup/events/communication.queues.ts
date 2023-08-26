import { type Queue } from '@/common/1.application/events/message-broker'

import { userSendEmailConfirmationQueue } from '@/communication/1.application/events/queues/user-send-email-confirmation.queue'

export const communicationQueues: Queue[] = [
  userSendEmailConfirmationQueue
]
