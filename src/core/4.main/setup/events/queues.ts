import { communicationQueues } from '@/communication/4.main/setup/events/communication-queues'
import { type Queue } from '@/core/1.application/types/queue'

export const queues: Queue[] = [
  ...communicationQueues
]
