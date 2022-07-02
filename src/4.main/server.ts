import 'dotenv/config'
import 'module-alias/register'

import { MongodbAdapter } from '@/3.infra/persistence/mongodb/adapter/mongodb'
// import { PostgresAdapter } from '@/3.infra/databases/postgres/adapter/postgres'
import ExpressApp from '@/3.infra/web/express/app/express'
// import FastifyApp from '@/3.infra/http/fastify/app/fastify'
import { setRoutes } from '@/4.main/config/set-routes'

const PORT = parseInt(process.env.PORT, 10)
const app = new ExpressApp()
// const app = new FastifyApp()

setRoutes(app, 'dist/4.main/routes')

MongodbAdapter.connect().then(async () => {
  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
  })
})

// PostgresAdapter.connect().then(async () => {
//   app.listen(PORT, () => {
//     console.log(`server running at http://localhost:${PORT}`)
//   })
// })
