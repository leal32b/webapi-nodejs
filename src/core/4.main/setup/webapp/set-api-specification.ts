import { WebApp } from '@/core/3.infra/api/app/web-app'
import { config } from '@/core/4.main/config'

export const setApiSpecification = (webApp: WebApp): void => {
  const { path, middlewares } = config.apiSpecification

  webApp.setApiSpecification(path, middlewares)
}
