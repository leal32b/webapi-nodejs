import { getVar, getIntVar } from '@/core/0.domain/utils/var'
import { type MessageBroker } from '@/core/1.application/events/message-broker'
import { AmqplibAdapter } from '@/core/3.infra/events/amqplib/amqplib-adapter'
import { logging } from '@/core/4.main/container/logging'

export const makeAmqplib: MessageBroker = AmqplibAdapter.create({
  connectParams: {
    hostname: getVar('RABBITMQ_HOST'),
    password: getVar('RABBITMQ_PASSWORD'),
    port: getIntVar('RABBITMQ_PORT'),
    protocol: getVar('RABBITMQ_PROTOCOL'),
    username: getVar('RABBITMQ_USERNAME')
  },
  logger: logging.logger
})
