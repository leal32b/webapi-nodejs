import { type MessageBroker } from '@/core/1.application/events/message-broker'
import { queues } from '@/core/4.main/setup/events/queues'
import { topics } from '@/core/4.main/setup/events/topics'

export const setupMessageBroker = (messageBroker: MessageBroker): void => {
  topics.forEach(topic => messageBroker.createTopic(topic))
  queues.forEach(queue => messageBroker.createQueue(queue))
}
