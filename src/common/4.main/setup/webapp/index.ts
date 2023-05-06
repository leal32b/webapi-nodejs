import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { setApiSpecification } from '@/common/4.main/setup/webapp/set-api-specification'
import { setContentType } from '@/common/4.main/setup/webapp/set-content-type'
import { setHeaders } from '@/common/4.main/setup/webapp/set-headers'
import { setRouters } from '@/common/4.main/setup/webapp/set-routers'

export const setupWebApp = (webApp: WebApp): void => {
  setApiSpecification(webApp)
  setContentType(webApp)
  setHeaders(webApp)
  setRouters(webApp)
}
