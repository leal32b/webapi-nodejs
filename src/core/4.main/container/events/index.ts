import { type MessageBroker } from '@/core/3.infra/events/message-broker'
import { makeRabbitmq } from '@/core/4.main/container/events/make-rabbitmq'

export type Events = {
  messageBroker: MessageBroker
}

export const events: Events = {
  messageBroker: makeRabbitmq
}
