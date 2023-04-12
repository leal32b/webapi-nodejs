import { communicationQueues } from '@/communication/4.main/setup/events/communication-queues'
import { type Queue } from '@/core/1.application/events/message-broker'

export const queues: Queue[] = [
  ...communicationQueues
]
