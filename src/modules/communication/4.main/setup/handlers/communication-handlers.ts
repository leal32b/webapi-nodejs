import { events } from '@/common/4.main/container/events'

import { userCreatedQueue } from '@/communication/1.application/events/queues/user-created-queue'
import { userCreatedHandlerFactory } from '@/communication/4.main/factories/handlers/user-created-handler-factory'

export const communicationHandlers = (): void => {
  events.messageBroker.subscribeToQueue(userCreatedQueue, userCreatedHandlerFactory())
}
