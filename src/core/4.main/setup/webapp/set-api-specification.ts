import { type WebApp } from '@/core/3.infra/api/app/web-app'
import { documentation } from '@/core/4.main/container'

export const setApiSpecification = (webApp: WebApp): void => {
  const path = '/api-docs'

  webApp.setApiSpecification(path, documentation.apiDocumenter)
}
