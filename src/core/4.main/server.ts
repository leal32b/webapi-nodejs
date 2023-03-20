import 'dotenv/config'
import 'module-alias/register'

import { app, persistence } from '@/core/4.main/container'
import { setHandlers } from '@/core/4.main/setup/handlers/set-handlers'
import { setupWebApp } from '@/core/4.main/setup/webapp'

const webApp = app.webApp

const bootstrap = async (): Promise<void> => {
  await persistence.actual.client.connect()
  setupWebApp(webApp)
  setHandlers()

  webApp.listen()
}

bootstrap()
