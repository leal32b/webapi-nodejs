import { type WebApp } from '@/core/3.infra/api/app/web-app'

export const setContentType = (webApp: WebApp): void => {
  webApp.setContentType('json')
}
