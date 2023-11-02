import { communicationHandlers } from '@/communication/4.main/setup/handlers/communication.handlers'
import { identityHandlers } from '@/identity/4.main/setup/handlers/identity.handlers'

export const setupHandlers = (): void => {
  communicationHandlers()
  identityHandlers()
}
