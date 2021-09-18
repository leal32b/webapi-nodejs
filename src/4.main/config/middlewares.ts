import { bodyParser } from '@/4.main/middlewares/body-parser'
import { cors } from '@/4.main/middlewares/cors'
import { Express } from 'express'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
