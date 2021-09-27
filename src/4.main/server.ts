import 'dotenv/config'
import 'module-alias/register'
import app from '@/4.main/config/app'
import { MongodbAdapter } from '@/3.infra/database/mongodb/adapter/mongodb'

const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_MONGODB_HOST

MongodbAdapter.connect(DATABASE_URL).then(async () => {
  app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT)
  })
})
