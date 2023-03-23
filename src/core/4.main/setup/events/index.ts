import { type MessageBroker } from '@/core/1.application/events/message-broker'
import { queues } from '@/core/4.main/setup/events/queues'

export const setupMessageBroker = async (messageBroker: MessageBroker): Promise<void> => {
  queues.forEach(queue => messageBroker.createQueue(queue))
}
