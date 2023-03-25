import { userCreatedQueue } from '@/communication/1.application/events/queues/user-created-queue'
import { userCreatedHandlerFactory } from '@/communication/4.main/factories/handlers/user-created-handler-factory'
import { events } from '@/core/4.main/container/events'

export const communicationHandlers = (): void => {
  events.messageBroker.subscribeToQueue(userCreatedQueue, userCreatedHandlerFactory())
}
