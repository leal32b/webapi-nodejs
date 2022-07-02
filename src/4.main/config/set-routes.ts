import { readdirSync } from 'fs'
import { join } from 'path'

import { Route } from '@/2.presentation/types/route'
import App from '@/3.infra/interfaces/web-app'

export const setRoutes = (app: App, rootPath: string): void => {
  const folders = readdirSync(rootPath)

  folders.map(folder => readdirSync(join(rootPath, folder))
    .filter(file => file.match(/.js$/))
    .map(async file => {
      const route = await import(join(process.cwd(), rootPath, folder, file))
      const { path, type, controller }: Route = route.default()

      app.setRoute({ path: `/api/${folder}${path}`, type, controller })
    })
  )
}
