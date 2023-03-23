import { getVar, getIntVar } from '@/core/0.domain/utils/var'
import { type MessageBroker } from '@/core/1.application/events/message-broker'
import { RabbitmqAdapter } from '@/core/3.infra/events/rabbitmq/rabbitmq-adapter'
import { logging } from '@/core/4.main/container/logging'

export const makeRabbitmq: MessageBroker = RabbitmqAdapter.create({
  connectParams: {
    hostname: getVar('RABBITMQ_HOST'),
    password: getVar('RABBITMQ_PASSWORD'),
    port: getIntVar('RABBITMQ_PORT'),
    username: getVar('RABBITMQ_USERNAME')
  },
  logger: logging.logger
})
