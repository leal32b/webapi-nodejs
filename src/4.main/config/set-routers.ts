import { readdirSync } from 'fs'
import { join } from 'path'

import WebApp from '@/3.infra/api/app/web-app'

export const setRouters = (app: WebApp, routersPath: string): void => {
  const folders = readdirSync(routersPath)

  folders.map(folder => readdirSync(join(routersPath, folder))
    .filter(file => file.match(/.js$/))
    .map(async file => {
      const router = await import(join(process.cwd(), routersPath, folder, file))

      app.setRouter(router.default())
    })
  )
}
