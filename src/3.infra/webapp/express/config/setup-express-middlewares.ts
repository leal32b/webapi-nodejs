import { Express, json, NextFunction, Request, Response } from 'express'

const bodyParser = json()

const contentTypes = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}

const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-headers', '*')
  next()
}

export const setupExpressMiddlewares = (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentTypes)
}
