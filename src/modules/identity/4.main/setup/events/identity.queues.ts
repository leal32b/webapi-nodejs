import { type Queue } from '@/common/1.application/events/message-broker'

import { userSetGroupQueue } from '@/identity/1.application/events/queues/user-set-group.queue'

export const identityQueues: Queue[] = [
  userSetGroupQueue
]
