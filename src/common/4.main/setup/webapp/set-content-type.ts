import { type WebApp } from '@/common/3.infra/webapp/web-app'

export const setContentType = (webApp: WebApp): void => {
  webApp.setContentType('json')
}
