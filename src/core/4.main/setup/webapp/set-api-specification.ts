import { WebApp } from '@/core/3.infra/api/app/web-app'
import { documentation } from '@/core/4.main/config'

export const setApiSpecification = (webApp: WebApp): void => {
  const { path, middlewares } = documentation.apiSpecification

  webApp.setApiSpecification(path, middlewares)
}