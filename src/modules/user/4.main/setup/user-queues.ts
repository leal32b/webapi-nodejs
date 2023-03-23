import { type Queue } from '@/core/1.application/types/queue'
import { userCreatedQueue } from '@/user/1.application/events/queues/user-created-queue'

export const userQueues: Queue[] = [
  userCreatedQueue
]
