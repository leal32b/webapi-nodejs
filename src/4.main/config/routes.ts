import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/4.main/routes/*.ts').map(async file =>
    (await import(file.replace(/src/, '@'))).default(router)
  )
}
