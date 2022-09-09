import 'dotenv/config'
import 'module-alias/register'

import { pg } from '@/core/3.infra/persistence/postgres/client/pg-client'
import { defaultDataSource } from '@/core/3.infra/persistence/postgres/data-sources/default'
import { config } from '@/core/4.main/config/config'
import { setRouters } from '@/core/4.main/config/set-routers'

const port = parseInt(process.env.PORT)
const webapp = config.app.webApp

const bootstrap = async (): Promise<void> => {
  await pg.connect(defaultDataSource)
  await setRouters(webapp, 'dist/modules/user/4.main/routers')

  webapp.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
  })
}

bootstrap()