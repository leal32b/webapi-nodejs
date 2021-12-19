import 'dotenv/config'
import 'module-alias/register'

import { MongodbAdapter } from '@/3.infra/databases/mongodb/adapter/mongodb'
// import { PostgresAdapter } from '@/3.infra/databases/postgres/adapter/postgres'
import app from '@/4.main/config/app'

const PORT = process.env.PORT

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
