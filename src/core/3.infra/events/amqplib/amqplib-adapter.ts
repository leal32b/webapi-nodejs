import amqplib, { type Channel, type Connection, type Options, type ConsumeMessage } from 'amqplib'

import { left, right, type Either } from '@/core/0.domain/utils/either'
import { type Event } from '@/core/1.application/base/event'
import { type Logger } from '@/core/1.application/logging/logger'
import { type Queue } from '@/core/1.application/types/queue'
import { type Topic } from '@/core/1.application/types/topic'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { type HandlerFn, type MessageBroker } from '@/core/3.infra/events/message-broker'

type Props = {
  connectParams: Options.Connect
  logger: Logger
}

export class AmqplibAdapter implements MessageBroker {
  private channel: Channel
  private connection: Connection

  private constructor (private readonly props: Props) {}

  public static create (props: Props): AmqplibAdapter {
    return new AmqplibAdapter(props)
  }

  public async connect (): Promise<Either<ServerError, void>> {
    const { connectParams, logger } = this.props

    try {
      this.connection = await amqplib.connect(connectParams)
      this.channel = await this.connection.createChannel()
      this.channel.prefetch(1)

      logger.info('events', `messageBroker connected: ${connectParams.hostname}`)

      return right()
    } catch (error) {
      logger.error('events', ['connect', error])

      return left(ServerError.create(error))
    }
  }

  public createQueue (queue: Queue): Either<ServerError, void> {
    const { logger } = this.props
    const { name: queueName, key, topics } = queue

    try {
      topics.forEach(topic => {
        const { name: topicName } = topic

        this.channel.assertQueue(queueName, { durable: true })
        this.channel.bindQueue(queueName, topicName, key.join('.'), {
          durable: true
        })

        logger.info('events', `queue created: [${topicName}] ${queueName}`)
      })

      return right()
    } catch (error) {
      logger.error('events', ['createQueue', error])

      return left(ServerError.create(error))
    }
  }

  public createTopic (topic: Topic): Either<ServerError, void> {
    const { logger } = this.props
    const { name } = topic

    try {
      this.channel.assertExchange(name, 'topic', {
        durable: true
      })

      logger.info('events', `topic created: ${name}`)

      return right()
    } catch (error) {
      logger.error('events', ['createTopic', error])

      return left(ServerError.create(error))
    }
  }

  public async publishToQueue (queue: Queue, event: Event<Record<string, unknown>>): Promise<Either<ServerError, void>> {
    const { logger } = this.props
    const adaptedEvent = {
      aggregateId: event.aggregateId,
      createdAt: event.createdAt,
      payload: event.payload
    }

    try {
      const sent = this.channel.sendToQueue(queue.name, Buffer.from(JSON.stringify(adaptedEvent)), { persistent: true })

      if (!sent) {
        return left(ServerError.create('error on publishing to queue'))
      }

      logger.info('events', [`event published to queue: [${queue.name}]`, adaptedEvent])

      return right()
    } catch (error) {
      logger.error('events', ['publishToQueue', error])

      return left(ServerError.create(error))
    }
  }

  public async publishToTopic (topic: Topic, key: string[], event: Event<Record<string, unknown>>): Promise<Either<ServerError, void>> {
    const { logger } = this.props
    const adaptedEvent = {
      aggregateId: event.aggregateId,
      createdAt: event.createdAt,
      payload: event.payload
    }

    try {
      const sent = this.channel.publish(
        topic.name,
        key.join('.'),
        Buffer.from(JSON.stringify(adaptedEvent)),
        { persistent: true }
      )

      if (!sent) {
        return left(ServerError.create('error on publishing to topic'))
      }

      logger.info('events', [`event published to topic: [${topic.name}]`, adaptedEvent])

      return right()
    } catch (error) {
      logger.error('events', ['publishToTopic', error])

      return left(ServerError.create(error))
    }
  }

  public subscribeToQueue (queue: Queue, handlerFn: HandlerFn): Either<ServerError, void> {
    const { logger } = this.props

    try {
      this.channel.consume(queue.name, async (msg: ConsumeMessage) => {
        const payload = JSON.parse(msg.content.toString())
        const resultOrError = await handlerFn(payload)

        logger[resultOrError.isLeft() ? 'error' : 'info']('events', [`handle: [${queue.name}]`, payload, resultOrError.value])

        if (resultOrError.isLeft()) {
          return
        }

        this.channel.ack(msg)
      }, {
        noAck: false
      })

      return right()
    } catch (error) {
      logger.error('events', ['handle', error])

      return left(ServerError.create(error))
    }
  }
}
