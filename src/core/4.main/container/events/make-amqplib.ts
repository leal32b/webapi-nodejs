import { getVar, getIntVar } from '@/core/0.domain/utils/var'
import { AmqplibAdapter } from '@/core/3.infra/events/amqplib/amqplib-adapter'
import { type MessageBroker } from '@/core/3.infra/events/message-broker'
import { logging } from '@/core/4.main/container/logging'

export const makeAmqplib: MessageBroker = AmqplibAdapter.create({
  connectParams: {
    hostname: getVar('RABBITMQ_HOST'),
    password: getVar('RABBITMQ_PASSWORD'),
    port: getIntVar('RABBITMQ_PORT'),
    username: getVar('RABBITMQ_USERNAME')
  },
  logger: logging.logger
})