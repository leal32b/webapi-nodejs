import { type DomainError } from '@/core/0.domain/base/domain-error'
import { type Either } from '@/core/0.domain/utils/either'
import { type Event } from '@/core/1.application/base/event'
import { type ServerError } from '@/core/2.presentation/errors/server-error'

export type Topic = {
  name: string
}

export type Queue = {
  name: string
  key: string[]
  topics: Topic[]
}

export type HandlerFn = (event: Event<Record<string, unknown>>) => Promise<Either<DomainError[], any>>

export interface MessageBroker {
  connect: () => Promise<Either<ServerError, void>>
  createQueue: (queue: Queue) => Either<ServerError, void>
  createTopic: (topic: Topic) => Either<ServerError, void>
  publishToQueue: (queue: Queue, payload: Event<Record<string, unknown>>) => Promise<Either<ServerError, void>>
  publishToTopic: (topic: Topic, key: string[], payload: Event<Record<string, unknown>>) => Promise<Either<ServerError, void>>
  subscribeToQueue: (queue: Queue, handlerFn: HandlerFn) => Either<ServerError, void>
}
