import 'dotenv/config'
import 'module-alias/register'

import { app, events, persistence } from '@/core/4.main/container'
import { setupMessageBroker } from '@/core/4.main/setup/events'
import { setHandlers } from '@/core/4.main/setup/handlers/set-handlers'
import { setupWebApp } from '@/core/4.main/setup/webapp'

const webApp = app.webApp
const messageBroker = events.messageBroker

const bootstrap = async (): Promise<void> => {
  await persistence.actual.client.connect()
  await messageBroker.connect()

  setupWebApp(webApp)
  setupMessageBroker(messageBroker)
  setHandlers()

  webApp.listen()
}

bootstrap()
