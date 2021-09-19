import 'module-alias/register'
import 'dotenv/config'
import app from '@/4.main/config/app'
import { MongodbHelper } from '@/3.infra/database/mongodb/helpers/mongodb'

const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_MONGODB_HOST

MongodbHelper.connect(DATABASE_URL).then(async () => {
  app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT)
  })
})
