import { events } from '@/common/4.main/container/events'

import { userSendEmailConfirmationQueue } from '@/communication/1.application/events/queues/user-send-email-confirmation.queue'
import { userSendEmailConfirmationHandlerFactory } from '@/communication/4.main/factories/handlers/user-send-email-confirmation.handler.factory'

export const communicationHandlers = (): void => {
  events.messageBroker.subscribeToQueue(userSendEmailConfirmationQueue, userSendEmailConfirmationHandlerFactory())
}
