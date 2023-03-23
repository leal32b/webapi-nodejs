import amqplib, { type Channel, type Connection, type Options } from 'amqplib'

import { left, right, type Either } from '@/core/0.domain/utils/either'
import { type MessageBroker } from '@/core/1.application/events/message-broker'
import { type Logger } from '@/core/1.application/logging/logger'
import { type Queue } from '@/core/1.application/types/queue'
import { ServerError } from '@/core/2.presentation/errors/server-error'

type Props = {
  connectParams: Options.Connect
  logger: Logger
}

export class RabbitmqAdapter implements MessageBroker {
  private channel: Channel
  private connection: Connection

  private constructor (private readonly props: Props) {}

  public static create (props: Props): RabbitmqAdapter {
    return new RabbitmqAdapter(props)
  }

  public async connect (): Promise<Either<ServerError, void>> {
    const { connectParams, logger } = this.props

    try {
      this.connection = await amqplib.connect(connectParams)
      this.channel = await this.connection.createChannel()

      logger.info('events', `messageBroker connected: ${connectParams.hostname}`)

      return right()
    } catch (error) {
      logger.error('events', ['connect', error])

      return left(ServerError.create(error))
    }
  }

  public createQueue (queue: Queue): Either<ServerError, void> {
    const { logger } = this.props
    const { name } = queue

    try {
      this.channel.assertQueue(name, {
        durable: false
      })

      logger.info('events', `queue created: ${name}`)

      return right()
    } catch (error) {
      logger.error('events', ['createQueue', error])

      return left(ServerError.create(error))
    }
  }
}
