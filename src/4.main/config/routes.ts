import { readdirSync } from 'fs'
import { join } from 'path'

import { Express, Router } from 'express'

export default async (app: Express): Promise<void> => {
  const router = Router()
  const rootPath = join(__dirname, '..', 'routes')
  const folders = readdirSync(rootPath)

  for (const folder of folders) {
    readdirSync(join(rootPath, folder)).map(async file => {
      try {
        if (!file.endsWith('.map')) {
          const route = await import(join(rootPath, folder, file))
          app.use(`/api/${folder}`, router)
          route.default(router)
        }
      } catch (error) {
        console.log(error)
      }
    })
  }
}
