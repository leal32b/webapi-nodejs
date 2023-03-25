import { type MessageBroker } from '@/core/3.infra/events/message-broker'
import { makeAmqplib } from '@/core/4.main/container/events/make-amqplib'

export type Events = {
  messageBroker: MessageBroker
}

export const events: Events = {
  messageBroker: makeAmqplib
}
