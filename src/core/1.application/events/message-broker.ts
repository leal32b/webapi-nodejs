import { type Either } from '@/core/0.domain/utils/either'
import { type Queue } from '@/core/1.application/types/queue'
import { type ServerError } from '@/core/2.presentation/errors/server-error'

export interface MessageBroker {
  connect: () => Promise<Either<ServerError, void>>
  createQueue: (queue: Queue) => Either<ServerError, void>
}
