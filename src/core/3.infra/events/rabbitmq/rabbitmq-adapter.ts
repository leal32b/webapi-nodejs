import amqplib, { type Channel, type Connection } from 'amqplib'

import { left, right, type Either } from '@/core/0.domain/utils/either'
import { type Queue } from '@/core/1.application/types/queue'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { type MessageBroker } from '@/core/3.infra/events/message-broker'

type Props = {
  host: string
}

export class RabbitmqAdapter implements MessageBroker {
  private channel: Channel
  private connection: Connection

  private constructor (private readonly props: Props) {}

  public static create (props: Props): RabbitmqAdapter {
    return new RabbitmqAdapter(props)
  }

  public async connect (): Promise<Either<ServerError, void>> {
    const { host } = this.props

    try {
      this.connection = await amqplib.connect(host)
      this.channel = await this.connection.createChannel()

      return right()
    } catch (error) {
      return left(ServerError.create(error))
    }
  }

  public createQueue (queue: Queue): Either<ServerError, void> {
    try {
      this.channel.assertQueue(queue.name, {
        durable: false
      })

      return right()
    } catch (error) {
      return left(ServerError.create(error))
    }
  }
}
