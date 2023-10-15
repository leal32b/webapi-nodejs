import { events } from '@/common/4.main/container/events'

import { userSetGroupQueue } from '@/identity/1.application/events/queues/user-set-group.queue'
import { userSetGroupHandlerFactory } from '@/identity/4.main/factories/handlers/user-set-group.handler.factory'

export const identityHandlers = (): void => {
  events.messageBroker.subscribeToQueue(userSetGroupQueue, userSetGroupHandlerFactory())
}
