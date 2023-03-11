import { type WebApp } from '@/core/3.infra/api/app/web-app'
import { setApiSpecification } from '@/core/4.main/setup/webapp/set-api-specification'
import { setContentType } from '@/core/4.main/setup/webapp/set-content-type'
import { setHeaders } from '@/core/4.main/setup/webapp/set-headers'
import { setRouters } from '@/core/4.main/setup/webapp/set-routers'

export const setupWebApp = (webApp: WebApp): void => {
  setApiSpecification(webApp)
  setContentType(webApp)
  setHeaders(webApp)
  setRouters(webApp)
}
