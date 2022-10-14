import { WebApp } from '@/core/3.infra/api/app/web-app'
import { makeExpress } from '@/core/4.main/config/app/make-express'

type App = {
  webApp: WebApp
}

export const app: App = {
  webApp: makeExpress
}
