import { Express, Router } from 'express'
import fs from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  const rootPath = path.join(__dirname, '..', 'routes')
  const folders = fs.readdirSync(rootPath)

  for (const folder of folders) {
    fs.readdirSync(path.join(rootPath, folder)).map(async file => {
      try {
        const route = await import(path.join(rootPath, folder, file))
        app.use(`/api/${folder}`, router)
        route.default(router)
      } catch (error) {
        console.log(error)
      }
    })
  }
}
