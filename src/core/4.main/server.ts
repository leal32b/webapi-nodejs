import 'dotenv/config'
import 'module-alias/register'

import { config } from '@/core/4.main/config/config'
import { setHandlers } from '@/core/4.main/setup/set-handlers'
import { setRouters } from '@/core/4.main/setup/set-routers'

const port = parseInt(process.env.PORT)
const webapp = config.app.webApp

const bootstrap = async (): Promise<void> => {
  await config.persistence.connect()
  webapp.app.use()
  setRouters(webapp)
  setHandlers()

  webapp.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
  })
}

bootstrap()
