import { type Queue } from '@/common/1.application/events/message-broker'

import { communicationQueues } from '@/communication/4.main/setup/events/communication.queues'
import { identityQueues } from '@/identity/4.main/setup/events/identity.queues'

export const queues: Queue[] = [
  ...communicationQueues,
  ...identityQueues
]
