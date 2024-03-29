import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { makeAmqplib } from '@/common/4.main/container/events/make-amqplib'

export type Events = {
  messageBroker: MessageBroker
}

export const events: Events = {
  messageBroker: makeAmqplib
}
