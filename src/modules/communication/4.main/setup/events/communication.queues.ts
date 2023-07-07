import { type Queue } from '@/common/1.application/events/message-broker'

import { userCreatedQueue } from '@/communication/1.application/events/queues/user-created.queue'

export const communicationQueues: Queue[] = [
  userCreatedQueue
]
