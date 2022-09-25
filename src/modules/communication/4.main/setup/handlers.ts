import { UserCreatedHandler } from '@/communication/1.application/handlers/user-created-handler'

export const setCommunicationHandlers = (): void => {
  new UserCreatedHandler()
}
