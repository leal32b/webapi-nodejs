import amqplib, { type Channel, type Connection, type Options } from 'amqplib/callback_api'

import { left, right, type Either } from '@/core/0.domain/utils/either'
import { ServerError } from '@/core/2.presentation/errors/server-error'
import { type MessageBrokerClient } from '@/core/3.infra/events/message-broker-client'

type Props = {
  host: string
}

export class RabbitmqAdapter implements MessageBrokerClient {
  private channel: Channel
  private connection: Connection

  private constructor (private readonly props: Props) {}

  public static create (props: Props): RabbitmqAdapter {
    return new RabbitmqAdapter(props)
  }

  public connect (): Either<ServerError, void> {
    const { host } = this.props

    try {
      amqplib.connect(host, (error, connection) => {
        if (error) {
          throw new Error(error)
        }

        this.connection = connection
      })

      const result = this.createChannel()

      return result
    } catch (error) {
      return left(ServerError.create(error))
    }
  }

  public createChannel (): Either<ServerError, void> {
    try {
      this.connection.createChannel((error, channel) => {
        if (error) {
          throw error
        }

        this.channel = channel
      })

      return right()
    } catch (error) {
      return left(ServerError.create(error))
    }
  }

  public createQueue (name: string, opt?: Options.AssertQueue): Either<ServerError, void> {
    try {
      this.channel.assertQueue(name, {
        ...opt,
        durable: false
      })

      return right()
    } catch (error) {
      return left(ServerError.create(error))
    }
  }
}
