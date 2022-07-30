import { readdirSync } from 'fs'
import { join } from 'path'

import WebApp from '@/3.infra/api/app/web-app'

export const setRouters = async (webApp: WebApp, routersPath: string): Promise<void> => {
  const files = readdirSync(routersPath).filter(file => file.match(/.js$/))

  for (const file of files) {
    const router = await import(join(process.cwd(), routersPath, file))
    router.default(webApp)
  }
}
