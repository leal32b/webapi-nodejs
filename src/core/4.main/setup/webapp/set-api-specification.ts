import { type WebApp } from '@/core/3.infra/webapp/web-app'
import { documentation } from '@/core/4.main/container'

export const setApiSpecification = (webApp: WebApp): void => {
  webApp.setApiSpecification('/api-docs', documentation.apiDocumenter.config)
}
