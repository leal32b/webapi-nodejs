import 'dotenv/config'
import 'module-alias/register'

import { pg } from '@/3.infra/persistence/postgres/client/pg-client'
import { defaultDataSource } from '@/3.infra/persistence/postgres/data-sources/default'
import ExpressAdapter from '@/3.infra/webapp/express/express-adapter'
import { setRouters } from '@/4.main/config/set-routers'

const bootstrap = async (): Promise<void> => {
  const PORT = parseInt(process.env.PORT)
  const app = new ExpressAdapter()

  setRouters(app, 'dist/4.main/routers')

  await pg.connect(defaultDataSource)

  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
  })
}

bootstrap()
