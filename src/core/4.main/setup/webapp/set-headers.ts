import { type WebApp } from '@/core/3.infra/api/app/web-app'

export const setHeaders = (webApp: WebApp): void => {
  webApp.setHeaders([
    { field: 'access-control-allow-origin', value: '*' },
    { field: 'access-control-allow-methods', value: '*' },
    { field: 'access-control-allow-headers', value: '*' }
  ])
}
