import { getVar, getIntVar } from '@/common/0.domain/utils/var'
import { type MessageBroker } from '@/common/1.application/events/message-broker'
import { AmqplibAdapter } from '@/common/3.infra/events/amqplib/amqplib.adapter'
import { logging } from '@/common/4.main/container/logging'

export const makeAmqplib: MessageBroker = AmqplibAdapter.create({
  connectParams: {
    hostname: getVar('RABBITMQ_HOST'),
    password: getVar('RABBITMQ_PASSWORD'),
    port: getIntVar('RABBITMQ_PORT'),
    protocol: getVar('RABBITMQ_PROTOCOL'),
    username: getVar('RABBITMQ_USERNAME'),
    vhost: getVar('RABBITMQ_VHOST')
  },
  logger: logging.logger
})
