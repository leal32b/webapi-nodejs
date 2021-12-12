import 'dotenv/config'
import 'module-alias/register'
import MongodbAdapter from '@/3.infra/databases/mongodb/adapter/mongodb'
import app from '@/4.main/config/app'

const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_MONGODB_HOST

MongodbAdapter.connect(DATABASE_URL).then(async () => {
  app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT)
  })
})
