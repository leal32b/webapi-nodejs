import 'dotenv/config'

import { app, persistence } from '@/common/4.main/container'
import { events } from '@/common/4.main/container/events'
import { setupMessageBroker } from '@/common/4.main/setup/events'
import { setupHandlers } from '@/common/4.main/setup/handlers'
import { setupWebApp } from '@/common/4.main/setup/webapp'

const webApp = app.webApp
const messageBroker = events.messageBroker

const bootstrap = async (): Promise<void> => {
  await persistence.actual.client.connect()
  await messageBroker.connect()

  setupWebApp(webApp)
  setupMessageBroker(messageBroker)
  setupHandlers()

  webApp.listen()
}

bootstrap()
