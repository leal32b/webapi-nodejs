import { userCreatedHandlerFactory } from '@/communication/4.main/factories/handlers/user-created-handler-factory'
import { events } from '@/core/4.main/container/events'
import { userCreatedQueue } from '@/user/1.application/events/queues/user-created-queue'

export const setCommunicationHandlers = (): void => {
  events.messageBroker.subscribeToQueue(userCreatedQueue, userCreatedHandlerFactory())
}
