import { type WebApp } from '@/common/3.infra/webapp/web-app'

export const setHeaders = (webApp: WebApp): void => {
  webApp.setHeaders([
    { field: 'access-control-allow-origin', value: '*' },
    { field: 'access-control-allow-methods', value: '*' },
    { field: 'access-control-allow-headers', value: '*' }
  ])
}
