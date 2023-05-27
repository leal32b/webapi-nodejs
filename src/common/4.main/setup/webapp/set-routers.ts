import { type WebApp } from '@/common/3.infra/webapp/web-app'

import { identityRouter } from '@/identity/4.main/setup/webapp/identity-router'

export const setRouters = (webApp: WebApp): void => {
  identityRouter(webApp)
}
