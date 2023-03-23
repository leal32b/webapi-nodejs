import { type Queue } from '@/core/1.application/types/queue'
import { userQueues } from '@/user/4.main/setup/user-queues'

export const queues: Queue[] = [
  ...userQueues
]
