import { type Either, right } from '@/core/0.domain/utils/either'
import { type Event } from '@/core/1.application/base/event'
import { type Queue } from '@/core/1.application/types/queue'
import { type Topic } from '@/core/1.application/types/topic'
import { type ServerError } from '@/core/2.presentation/errors/server-error'
import { type HandlerFn, type MessageBroker } from '@/core/3.infra/events/message-broker'

export const makeMessageBrokerMock = (): MessageBroker => {
  class MessageBrokerMock implements MessageBroker {
    createTopic: (topic: Topic) => Either<ServerError, void>
    public static create (): MessageBrokerMock {
      return new MessageBrokerMock()
    }

    async connect (): Promise<Either<ServerError, void>> {
      return right()
    }

    createQueue (queue: Queue): Either<ServerError, void> {
      return right()
    }

    async publishToQueue (queue: Queue, payload: Event<Record<string, unknown>>): Promise<Either<ServerError, void>> {
      return right()
    }

    async publishToTopic (topic: Topic, key: string[], payload: Event<Record<string, unknown>>): Promise<Either<ServerError, void>> {
      return right()
    }

    subscribeToQueue (queue: Queue, handlerFn: HandlerFn): Either<ServerError, void> {
      return right()
    }
  }

  return MessageBrokerMock.create()
}
