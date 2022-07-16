import 'dotenv/config'
import 'module-alias/register'

import pg from '@/3.infra/persistence/postgres/client/pg-client'
import { defaultDataSource } from '@/3.infra/persistence/postgres/data-sources/default'
import ExpressApp from '@/3.infra/web/express/app/express'
import { setRoutes } from '@/4.main/config/set-routes'

const bootstrap = async (): Promise<void> => {
  const PORT = parseInt(process.env.PORT)
  const app = new ExpressApp()

  setRoutes(app, 'dist/4.main/routes')

  await pg.connect(defaultDataSource)

  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
  })
}

bootstrap()
