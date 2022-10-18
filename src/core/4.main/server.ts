import 'dotenv/config'
import 'module-alias/register'

import { config } from '@/core/4.main/config'
import { setHandlers } from '@/core/4.main/setup/handlers/set-handlers'
import { setupWebApp } from '@/core/4.main/setup/webapp'

const port = parseInt(process.env.PORT)
const webApp = config.app.webApp

const bootstrap = async (): Promise<void> => {
  await config.persistence.connect()
  setupWebApp(webApp)
  setHandlers()

  webApp.listen(port)
}

bootstrap()
