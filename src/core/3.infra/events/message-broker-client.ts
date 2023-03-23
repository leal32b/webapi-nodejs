import { type Either } from '@/core/0.domain/utils/either'
import { type ServerError } from '@/core/2.presentation/errors/server-error'

export interface MessageBrokerClient {
  connect: () => Either<ServerError, void>
  createChannel: () => Either<ServerError, void>
  createQueue: (name: string, opt?: Record<string, unknown>) => Either<ServerError, void>
}
