import { userCreatedQueue } from '@/communication/1.application/events/queues/user-created-queue'
import { type Queue } from '@/core/1.application/types/queue'

export const communicationQueues: Queue[] = [
  userCreatedQueue
]
