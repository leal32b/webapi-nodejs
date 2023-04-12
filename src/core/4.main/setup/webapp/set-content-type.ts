import { type WebApp } from '@/core/3.infra/webapp/web-app'

export const setContentType = (webApp: WebApp): void => {
  webApp.setContentType('json')
}
