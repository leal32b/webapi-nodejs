import { type WebApp } from '@/common/3.infra/webapp/web-app'
import { documentation } from '@/common/4.main/container'

export const setApiSpecification = (webApp: WebApp): void => {
  webApp.setApiSpecification('/api-docs', documentation.apiDocumenter.config)
}
