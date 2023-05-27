import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { queues } from '@/common/4.main/setup/events/queues'
import { topics } from '@/common/4.main/setup/events/topics'

export const setupMessageBroker = (messageBroker: MessageBroker): void => {
  topics.forEach(topic => messageBroker.createTopic(topic))
  queues.forEach(queue => messageBroker.createQueue(queue))
}
