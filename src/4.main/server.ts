import 'dotenv/config'
import 'module-alias/register'

import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { defaultDataSource } from '@/3.infra/persistence/postgres/data-sources/default'
import { config } from '@/4.main/config/config'
import { setRouters } from '@/4.main/config/set-routers'

const bootstrap = async (): Promise<void> => {
  const PORT = parseInt(process.env.PORT)
  const webapp = config.app.webApp

  await pg.connect(defaultDataSource)
  await setRouters(webapp, 'dist/4.main/routers')

  webapp.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
  })
}

bootstrap()
